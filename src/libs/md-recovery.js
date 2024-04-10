const vscode = require('vscode');
const message = require('./message');
const directory = require('./directory');

const recovery = async () => {
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

        let text = editor.document.getText();

        // get image 
        let regMath = /^!\[[^\[\]]*\]\([^\(\)]*\)[\s]*$/gm
        let mathArray = text.match(regMath);

        if (mathArray != null && mathArray != undefined && mathArray.length > 0) {

            let loop = 10000;
            let fileBaseName = (new Date()).getTime();
            let fileBaseImagepath = sourceFileDic;

            let baseStoreImageDir = directory.join(fileBaseImagepath, "images");

            if (!directory.exist(baseStoreImageDir)) {
                directory.createDir(baseStoreImageDir);
            }

            // Loop images
            for (const item of mathArray) {
                loop++;
                let fileName = directory.join("images", `${fileBaseName}${loop}.png`);
                let fileImagePath = directory.join(fileBaseImagepath, fileName);

                // get real file path
                let imageBase64 = item.slice(item.indexOf("(") + 1, item.indexOf(")"));
                if (!imageBase64.startsWith("data:image/png;base64,")) {
                    continue;
                }

                directory.base64ToImage(imageBase64, fileImagePath);
                let imageTxt = item.replace(imageBase64, fileName);
                text = text.replace(item, imageTxt);
            }
        }

        // save file
        directory.saveFile(sourceFilePath, text);
        message.success('success save ');
        return;


    } catch (error) {
        message.error(`markdownmdEx():${error}`);
    }
}

module.exports = {
    recovery: recovery
}
