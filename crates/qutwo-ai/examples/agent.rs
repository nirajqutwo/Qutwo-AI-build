use dotenvy::dotenv;
use futures::StreamExt;
use qutwo_ai::agents::{
    AgentEvent, ExtensionConfig, SessionConfig, StateMachineServices, StateMachineServicesConfig,
};
use qutwo_ai::config::{QutwoAiMode, DEFAULT_EXTENSION_DESCRIPTION, DEFAULT_EXTENSION_TIMEOUT};
use qutwo_ai::conversation::message::Message;
use qutwo_ai::providers::create;
use qutwo_ai::session::session_manager::SessionType;
use qutwo_ai_providers::databricks::DATABRICKS_DEFAULT_MODEL;
use std::path::PathBuf;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let _ = dotenv();

    let provider = create("databricks", Vec::new()).await?;
    let model_config =
        qutwo_ai::model_config::model_config_from_user_config("databricks", DATABRICKS_DEFAULT_MODEL)?;

    let services = StateMachineServices::with_config(StateMachineServicesConfig::cli());

    let session = services
        .session_manager
        .create_session(
            PathBuf::default(),
            "max-turn-test".to_string(),
            SessionType::Hidden,
            QutwoAiMode::default(),
        )
        .await?;

    services
        .update_provider(provider, model_config, &session.id)
        .await?;

    let config = ExtensionConfig::stdio(
        "developer",
        "./target/debug/qutwo-ai",
        DEFAULT_EXTENSION_DESCRIPTION,
        DEFAULT_EXTENSION_TIMEOUT,
    )
    .with_args(vec!["mcp", "developer"]);
    services
        .extension_manager
        .enable(&session.id, config)
        .await?;

    println!("Extensions:");
    for extension in services
        .extension_manager
        .list_extensions(&session.id)
        .await?
    {
        println!("  {}", extension);
    }

    let session_config = SessionConfig {
        id: session.id,
        schedule_id: None,
        max_turns: None,
    };

    let user_message = Message::user()
        .with_text("can you summarize the readme.md in this dir using just a haiku?");

    let mut stream = services.reply(user_message, session_config, None).await?;

    while let Some(Ok(AgentEvent::Message(message))) = stream.next().await {
        println!("{}", serde_json::to_string_pretty(&message)?);
        println!("\n");
    }

    Ok(())
}
