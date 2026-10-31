package io.github.aaif_qutwo_ai.providers.anthropic

public fun provider(
    apiKey: String,
    baseUrl: String? = null,
    betaHeaders: List<String> = emptyList(),
): io.github.aaif_qutwo_ai.Provider = io.github.aaif_qutwo_ai.anthropicProvider(apiKey, baseUrl, betaHeaders)

public fun defaultModel(): String = io.github.aaif_qutwo_ai.anthropicDefaultModel()
