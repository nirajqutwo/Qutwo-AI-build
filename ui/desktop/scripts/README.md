# QutwoAiy

Put `qutwoaiy` in your $PATH if you want to launch via:

```
qutwoaiy .
```

This will open qutwo-ai GUI from any path you specify

# Unregister Deeplink Protocols (macos only)

`unregister-deeplink-protocols.js` is a script to unregister the deeplink protocol used by qutwo-ai like `qutwo-ai://`.
This is handy when you want to test deeplinks with the development version of Qutwo-AI.

# Usage

To unregister the deeplink protocols, run the following command in your terminal:
Then launch Qutwo-AI again and your deeplinks should work from the latest launched qutwo-ai application as it is registered on startup.

```bash
node scripts/unregister-deeplink-protocols.js
```

