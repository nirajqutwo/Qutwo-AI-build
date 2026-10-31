package io.github.aaif_qutwo_ai.providers.databricks

public fun provider(host: String, token: String): io.github.aaif_qutwo_ai.Provider =
    io.github.aaif_qutwo_ai.databricksProvider(host, token)

public fun defaultModel(): String = io.github.aaif_qutwo_ai.databricksDefaultModel()
