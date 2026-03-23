const vscode = require('vscode');

async function activate(context) {
    // Sicherstellen dass VSCODE_WS in terminal env gesetzt ist
    const config = vscode.workspace.getConfiguration('terminal.integrated.env');
    const current = config.get('linux') || {};
    
    if (!current.VSCODE_WS) {
        await config.update(
            'linux',
            { ...current, VSCODE_WS: '${workspaceFolder}' },
            vscode.ConfigurationTarget.Global
        );
        vscode.window.showInformationMessage('Vault Browser: VSCODE_WS wurde in den Settings gesetzt.');
    }

    // Watcher setup...
    const watcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], '.vopen')
    );

    async function openUrlFromFile(uri) {
        try {
            const data = await vscode.workspace.fs.readFile(uri);
            const url = data.toString().trim();
            if (url.startsWith('http') && vscode.window.state.focused) {
                await vscode.workspace.fs.delete(uri);
                await vscode.commands.executeCommand('simpleBrowser.show', url);
            }
        } catch (e) {
            console.error("Fehler:", e);
        }
    }

    watcher.onDidChange(uri => openUrlFromFile(uri));
    watcher.onDidCreate(uri => openUrlFromFile(uri));
    context.subscriptions.push(watcher);
}

exports.activate = activate;