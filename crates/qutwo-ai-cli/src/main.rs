#![recursion_limit = "256"]

use anyhow::Result;
use qutwo_ai_cli::cli::cli;

/// Enable ANSI/VT escape sequence processing on Windows Console Host.
///
/// Without this, spinners and progress bars from cliclack/indicatif render as
/// repeated new lines instead of updating in place, because Windows Console Host
/// does not process ANSI escapes by default.
#[cfg(windows)]
fn enable_windows_vt_processing() {
    // colors_supported() has the side effect of calling SetConsoleMode with
    // ENABLE_VIRTUAL_TERMINAL_PROCESSING on the underlying console handle.
    let _ = console::Term::stdout().features().colors_supported();
    let _ = console::Term::stderr().features().colors_supported();
}

async fn run() -> Result<()> {
    if let Err(e) = qutwo_ai_cli::logging::setup_logging(None) {
        eprintln!("Warning: Failed to initialize logging: {}", e);
    }

    #[cfg(feature = "online-model-meta")]
    qutwo_ai::model_catalog::initialize();

    let result = cli().await;

    #[cfg(feature = "otel")]
    if qutwo_ai::otel::otlp::is_otlp_initialized() {
        qutwo_ai::otel::otlp::shutdown_otlp();
    }

    result
}

fn main() -> Result<()> {
    qutwo_ai::config::paths::Paths::isolate_process_environment();

    #[cfg(windows)]
    enable_windows_vt_processing();

    let handle = std::thread::Builder::new()
        .name("qutwo-ai-cli-main".to_string())
        .stack_size(8 * 1024 * 1024)
        .spawn(|| {
            let runtime = tokio::runtime::Builder::new_multi_thread()
                .enable_all()
                .build()
                .expect("Failed to build Tokio runtime");
            runtime.block_on(run())
        })
        .map_err(|e| anyhow::anyhow!("Failed to spawn qutwo-ai-cli main thread: {}", e))?;

    handle
        .join()
        .map_err(|_| anyhow::anyhow!("qutwo-ai-cli main thread panicked"))?
}
