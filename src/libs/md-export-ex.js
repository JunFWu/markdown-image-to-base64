const vscode = require('vscode');
const message = require('./message');
const directory = require('./directory');

const markdownExportEx = async () => {
    try {
        // check active window
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            message.warn('No active Editor!');
            return;
        }

        // check markdown mode
        var mode = editor.document.languageId;
        if (mode != 'markdown') {
            message.warn('It is not a markdown mode!');
            return;
        }

        var sourceFilePath = editor.document.uri.fsPath;
        if (!directory.exist(sourceFilePath)) {
            if (editor.document.isUntitled) {
                message.warn('Please save the file!');
                return;
            }
            message.warn('File name does not get!');
            return;
        }

        let ext = directory.getFileNameWithExtension(sourceFilePath);
        if (ext != ".md") {
            message.warn('File Extension does not md!');
            return;
        }


        let sourceFileDic = directory.getDirectoryPath(sourceFilePath);
        let saveFilePathUri = await vscode.window.showSaveDialog({
            defaultUri: editor.document.uri,
            filters: {
                'markdown': ['md']
            }
        });

        if (saveFilePathUri == undefined || saveFilePathUri == null
            || saveFilePathUri.fsPath == undefined || saveFilePathUri.fsPath == null || saveFilePathUri.fsPath == "") {
            return;
        }

        let saveFilePath = saveFilePathUri.fsPath;
        if (saveFilePath == sourceFilePath) {
            message.warn('Cannot Overwrite Current File');
            return;
        }


        let text = editor.document.getText();


        // get image 
        let regMath = /^!\[[^\[\]]*\]\([^\(\)]*\)[\s]*$/gm
        let mathArray = text.match(regMath);

        if (mathArray != null && mathArray != undefined && mathArray.length > 0) {
            // Loop images
            for (const item of mathArray) {

                // get real file path
                let imageFilePath = item.slice(item.indexOf("(") + 1, item.indexOf(")"));
                let imageFileRealUri = directory.join(sourceFileDic, imageFilePath);

                if (directory.exist(imageFileRealUri)) {
                    // read image file to base64
                    let imageBase64 = directory.fileToBase64(imageFileRealUri);

                    // Convert images in text to base64
                    let imageTxt = item.replace(imageFilePath, "data:image/png;base64," + imageBase64);
                    text = text.replace(item, imageTxt);
                }
            }
        }

        // save file
        directory.saveFile(saveFilePath, text);
        message.success('success save ' + saveFilePath);
        return;


    } catch (error) {
        message.error(`markdownmdEx():${error}`);
    }
}

module.exports = {
    export: markdownExportEx
}
