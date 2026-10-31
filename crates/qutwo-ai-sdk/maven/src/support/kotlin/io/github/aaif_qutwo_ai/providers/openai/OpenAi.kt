package io.github.aaif_qutwo_ai.providers.openai

public fun provider(
    apiKey: String,
    baseUrl: String? = null,
): io.github.aaif_qutwo_ai.Provider = io.github.aaif_qutwo_ai.openaiProvider(apiKey, baseUrl)

public fun defaultModel(): String = io.github.aaif_qutwo_ai.openaiDefaultModel()
