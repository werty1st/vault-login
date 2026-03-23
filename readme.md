# Vault Browser

Opens Vault OIDC authentication URLs automatically in the VS Code integrated browser — no copy-pasting, no external browser needed.

## How it works

1. Vault calls `xdg-open` with the Google auth URL
2. `xdg-open` writes the URL to `.vopen` in your workspace root
3. This extension detects the file and opens the URL in the integrated browser

## Setup

### On the GCP Cloud Workstation

Add this to `~/.local/bin/xdg-open`:
```sh
#!/bin/sh
echo "$1" > "${VSCODE_WS:-$PWD}/.vopen"
```
```sh
chmod +x ~/.local/bin/xdg-open
```

### VS Code Settings

The extension sets this automatically on first start:
```json
{
  "terminal.integrated.env.linux": {
    "VSCODE_WS": "${workspaceFolder}"
  }
}
```

## Usage
```sh
vault login -address=https://vault.host.de -method=oidc -path=google
```

The browser opens automatically inside VS Code. Log in, done.

## Requirements

- VS Code with Remote SSH extension
- GCP Cloud Workstation
- Vault CLI
