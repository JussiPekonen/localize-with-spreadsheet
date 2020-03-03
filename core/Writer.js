var fs = require('fs');
var EOL = require('os').EOL;
var path = require('path');

var Writer = function () {

};

Writer.prototype.write = function (filePath, lines, transformer) {

};


var FileWriter = function () {
};

FileWriter.prototype.write = function (filePath, encoding, lines, transformer, options, isIOSDictFormat) {
    var fileContent = '';
    if (fs.existsSync(filePath)) {
        fileContent = fs.readFileSync(filePath, encoding);
    }

     var valueToInsert = this.getTransformedLines(lines, transformer, isIOSDictFormat, options.valueCol);

     if (isIOSDictFormat === true) {
        valueToInsert = valueToInsert.replace(/\/\/.*/gi, "") // Remove unnecessary comments
        var output = transformer.insertForIOSDictFormat(fileContent, valueToInsert, options);
     } else {
        var output = transformer.insert(fileContent, valueToInsert, options);
     }

    output = output.replace(/\n\n\s*\n/g, '\n'); // Remove unnecessary enters
    writeFileAndCreateDirectoriesSync(filePath, output, 'utf8');
};

//https://gist.github.com/jrajav/4140206
var writeFileAndCreateDirectoriesSync = function (filepath, content, encoding) {
    var dirname = path.dirname(filepath);
    if (!fs.existsSync(dirname)){
        fs.mkdirSync(dirname);
    }
    fs.writeFileSync(filepath, content, encoding);
};

FileWriter.prototype.getTransformedLines = function (lines, transformer, isIOSDictFormat, valueCol) {
    var valueToInsert = '';
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (!line.isEmpty()) {
            if (line.isComment()) {
                valueToInsert += EOL + transformer.transformComment(line.getComment()) + getNewLineIfNecessary(i, lines);
            } else {
                if(isEmpty(line.getValue())) { 
                    console.log("%s - String for id: %s is empty", valueCol, line.getKey());
                } else {
                    valueToInsert += transformer.transformKeyValue(line.getKey(), line.getValue(), isIOSDictFormat) + getNewLineIfNecessary(i, lines);
                }
            }
        }
    }

    return valueToInsert;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function getNewLineIfNecessary(index, lines) {
    if (index != lines.length - 1) {
        return EOL;
    }
    return '';
}

var FakeWriter = function () {

};

FakeWriter.prototype.write = function (filePath, lines, transformer) {

};

module.exports = { File: FileWriter, Fake: FakeWriter };
