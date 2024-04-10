const vscode = require('vscode');

const warn = (message) => {
    vscode.window.showWarningMessage(message);
}

const error = (message) => {
    vscode.window.showErrorMessage(message);
}


const success = (message) => {
    vscode.window.showInformationMessage(message);
} 

module.exports = {
    warn,
    error,
    success
}