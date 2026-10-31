use anyhow::{bail, Result};

#[tokio::main]
async fn main() -> Result<()> {
    let mut builtins = Vec::new();
    let mut args = std::env::args().skip(1);

    while let Some(arg) = args.next() {
        match arg.as_str() {
            "--with-builtin" => {
                let Some(value) = args.next() else {
                    bail!("--with-builtin requires a comma-separated value");
                };
                builtins.extend(
                    value
                        .split(',')
                        .filter(|name| !name.is_empty())
                        .map(str::to_owned),
                );
            }
            "-h" | "--help" => {
                println!("Usage: qutwo-ai-acp [--with-builtin <NAME,...>]");
                return Ok(());
            }
            "-V" | "--version" => {
                println!("qutwo-ai-acp {}", env!("CARGO_PKG_VERSION"));
                return Ok(());
            }
            unknown => bail!("unknown argument: {unknown}"),
        }
    }

    #[cfg(feature = "online-model-meta")]
    qutwo_ai::model_catalog::initialize();

    qutwo_ai::acp::server::run(builtins, false).await
}
