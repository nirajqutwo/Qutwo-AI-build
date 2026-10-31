use crate::conversation::message::Message;
use crate::conversation::Conversation;
use crate::providers::base::ProviderUsage;
use crate::recipe::Recipe;
use crate::session::ExtensionState;
use anyhow::Result;
use qutwo_ai_agent::operation::{ConversationEffect, MachineEffect};

pub enum QutwoAiEffect {
    Conversation(ConversationEffect),
    CompactConversation {
        conversation: Conversation,
        usage: Option<ProviderUsage>,
    },
    SetRecipe(Box<Option<Recipe>>),
    SetExtensionState {
        extension_name: &'static str,
        version: &'static str,
        value: serde_json::Value,
    },
    RecordUsage(ProviderUsage),
}

impl QutwoAiEffect {
    pub fn extension_state<S: ExtensionState>(state: &S) -> Result<Self> {
        Ok(QutwoAiEffect::SetExtensionState {
            extension_name: S::EXTENSION_NAME,
            version: S::VERSION,
            value: state.to_value()?,
        })
    }
}

impl MachineEffect for QutwoAiEffect {
    fn ensure_message_ids(&mut self) {
        match self {
            QutwoAiEffect::Conversation(effect) => effect.ensure_message_ids(),
            QutwoAiEffect::CompactConversation { conversation, .. } => {
                for message in conversation.messages_mut() {
                    if message.id.is_none() {
                        message.id = Some(format!("msg_{}", uuid::Uuid::new_v4()));
                    }
                }
            }
            _ => {}
        }
    }
}

impl From<ConversationEffect> for QutwoAiEffect {
    fn from(effect: ConversationEffect) -> Self {
        QutwoAiEffect::Conversation(effect)
    }
}

impl From<Message> for QutwoAiEffect {
    fn from(message: Message) -> Self {
        ConversationEffect::from(message).into()
    }
}

impl From<Conversation> for QutwoAiEffect {
    fn from(conversation: Conversation) -> Self {
        ConversationEffect::from(conversation).into()
    }
}
