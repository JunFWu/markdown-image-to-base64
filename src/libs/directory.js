const fs = require('fs');
var path = require('path');

const exist = (path) => {
    if (path.length === 0) {
        return false;
    }
    try {
        fs.accessSync(path);
        return true;
    } catch (error) {
        console.warn(error.message);
        return false;
    }
}

const getFileNameWithExtension = (filePath) => {
    return path.extname(filePath);
}

const getDirectoryPath = (filePath) => {
    return path.dirname(filePath);
}

const join = (path1, path2) => {
    return path.join(path1, path2);
}


const fileToBase64 = (filePath) => {
    let imageFile = fs.readFileSync(filePath);
    return imageFile.toString('base64');
}

const saveFile = (savePath, data) => {
    fs.writeFileSync(savePath, data);
}

const base64ToImage = (fileData, savefilePath) => {
    fileData = fileData.replace("data:image/png;base64,", "");
    let buffer = Buffer.from(fileData, 'base64');
    fs.writeFileSync(savefilePath, buffer, 'binary');
}

const createDir = (dirPath) => {
    fs.mkdirSync(dirPath);
}


module.exports = {
    exist,
    getFileNameWithExtension,
    getDirectoryPath,
    join,
    fileToBase64,
    saveFile,
    base64ToImage,
    createDir
}
