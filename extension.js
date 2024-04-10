// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const markdownExportEx = require('./src/libs/md-export-ex');
const markdownRecoveryEx = require('./src/libs/md-recovery');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	var commands = [
		vscode.commands.registerCommand('extension.markdown-image-to-base64.export', async function () { await markdownExportEx.export(); }),
		vscode.commands.registerCommand('extension.markdown-image-to-base64.recovery', async function () { await markdownRecoveryEx.recovery(); }),
	];


	commands.forEach(function (command) {
		context.subscriptions.push(command);
	});


}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
