use once_cell::sync::Lazy;
#[cfg(any(
    feature = "autovisualiser",
    feature = "computer-controller",
    feature = "memory-server",
    feature = "tutorial-server"
))]
use rmcp::{ServerHandler, ServiceExt};
use std::collections::HashMap;

/// Portable workspace root: `QUTWO_AI_PATH_ROOT` when set, else the folder of the running
/// executable. Mirrors `qutwo_ai::config::paths::Paths::workspace_root`.
pub fn workspace_root() -> std::path::PathBuf {
    if let Some(root) = std::env::var_os("QUTWO_AI_PATH_ROOT")
        .map(std::path::PathBuf::from)
        .filter(|p| p.is_absolute())
    {
        return root;
    }
    std::env::current_exe()
        .ok()
        .and_then(|exe| exe.parent().map(std::path::PathBuf::from))
        .expect("qutwo-ai cannot determine its own install folder")
}

#[cfg(feature = "autovisualiser")]
pub mod autovisualiser;
#[cfg(feature = "computer-controller")]
pub mod computercontroller;
#[cfg(any(
    feature = "autovisualiser",
    feature = "computer-controller",
    feature = "memory-server",
    feature = "tutorial-server"
))]
pub mod mcp_server_runner;
#[cfg(feature = "memory-server")]
mod memory;
#[cfg(all(target_os = "macos", feature = "computer-controller"))]
pub mod peekaboo;
#[cfg(feature = "computer-controller")]
pub mod subprocess;
#[cfg(feature = "tutorial-server")]
pub mod tutorial;

#[cfg(feature = "autovisualiser")]
pub use autovisualiser::AutoVisualiserRouter;
#[cfg(feature = "computer-controller")]
pub use computercontroller::ComputerControllerServer;
#[cfg(feature = "memory-server")]
pub use memory::MemoryServer;
#[cfg(feature = "tutorial-server")]
pub use tutorial::TutorialServer;

pub type SpawnServerFn = fn(tokio::io::DuplexStream, tokio::io::DuplexStream);

#[cfg(any(
    feature = "autovisualiser",
    feature = "computer-controller",
    feature = "memory-server",
    feature = "tutorial-server"
))]
fn spawn_and_serve<S>(
    name: &'static str,
    server: S,
    transport: (tokio::io::DuplexStream, tokio::io::DuplexStream),
) where
    S: ServerHandler + Send + 'static,
{
    tokio::spawn(async move {
        match server.serve(transport).await {
            Ok(running) => {
                let _ = running.waiting().await;
            }
            Err(e) => tracing::error!(builtin = name, error = %e, "server error"),
        }
    });
}

#[cfg(any(
    feature = "autovisualiser",
    feature = "computer-controller",
    feature = "memory-server",
    feature = "tutorial-server"
))]
macro_rules! builtin {
    ($name:ident, $server_ty:ty) => {{
        fn spawn(r: tokio::io::DuplexStream, w: tokio::io::DuplexStream) {
            spawn_and_serve(stringify!($name), <$server_ty>::new(), (r, w));
        }
        (stringify!($name), spawn as SpawnServerFn)
    }};
}

pub static BUILTIN_EXTENSIONS: Lazy<HashMap<&'static str, SpawnServerFn>> = Lazy::new(|| {
    #[allow(unused_mut)]
    let mut extensions = HashMap::new();
    #[cfg(feature = "autovisualiser")]
    extensions.extend([builtin!(autovisualiser, AutoVisualiserRouter)]);
    #[cfg(feature = "computer-controller")]
    extensions.extend([builtin!(computercontroller, ComputerControllerServer)]);
    #[cfg(feature = "memory-server")]
    extensions.extend([builtin!(memory, MemoryServer)]);
    #[cfg(feature = "tutorial-server")]
    extensions.extend([builtin!(tutorial, TutorialServer)]);
    extensions
});
