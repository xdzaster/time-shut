#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Command;
use tauri::{Window, WindowEvent};

#[tauri::command]
fn schedule_shutdown(seconds: u64) -> Result<String, String> {
    let minutes = seconds / 60;

    let result = if cfg!(target_os = "windows") {
        Command::new("shutdown")
            .args(&["/s", "/t", &seconds.to_string()])
            .output()
    } else if cfg!(target_os = "macos") {
        Command::new("sudo")
            .args(&["shutdown", "-h", &format!("+{}", minutes)])
            .output()
    } else if cfg!(target_os = "linux") {
        Command::new("shutdown")
            .args(&[&format!("+{}", minutes)])
            .output()
    } else {
        return Err("Unsupported platform.".to_string());
    };

    match result {
        Ok(_) => Ok(format!("System shutdown scheduled in {} minutes.", minutes)),
        Err(e) => Err(format!("Failed to schedule shutdown: {}", e)),
    }
}

/// Helper function to cancel shutdown
fn cancel_shutdown_internal() -> Result<String, String> {
    let result = if cfg!(target_os = "windows") {
        Command::new("shutdown").arg("/a").output()
    } else if cfg!(target_os = "macos") {
        Command::new("sudo").arg("killall").arg("shutdown").output()
    } else if cfg!(target_os = "linux") {
        Command::new("shutdown").arg("-c").output()
    } else {
        return Err("Unsupported platform.".to_string());
    };

    match result {
        Ok(_) => Ok("Shutdown has been canceled.".to_string()),
        Err(e) => Err(format!("Failed to cancel shutdown: {}", e)),
    }
}

/// Tauri command that invokes the cancel_shutdown_internal function
#[tauri::command]
fn cancel_shutdown() -> Result<String, String> {
    cancel_shutdown_internal()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![schedule_shutdown, cancel_shutdown])
        .on_window_event(|_window: &Window, event: &WindowEvent| {
            if let WindowEvent::CloseRequested { .. } = event {
                match cancel_shutdown_internal() {
                    Ok(msg) => println!("{}", msg),
                    Err(err) => eprintln!("Error: {}", err),
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
