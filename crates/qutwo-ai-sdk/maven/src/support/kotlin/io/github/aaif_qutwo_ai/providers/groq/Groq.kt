package io.github.aaif_qutwo_ai.providers.groq

public fun provider(apiKey: String): io.github.aaif_qutwo_ai.Provider = io.github.aaif_qutwo_ai.groqProvider(apiKey)

public fun defaultModel(): String = io.github.aaif_qutwo_ai.groqDefaultModel()
