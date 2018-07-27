var fs = require('fs');
var EOL = require('os').EOL;

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

     var valueToInsert = this.getTransformedLines(lines, transformer, isIOSDictFormat);

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
    var mkpath = require('mkpath');
    var path = require('path');

    var dirname = path.dirname(filepath);
    mkpath.sync(dirname);

    fs.writeFileSync(filepath, content, encoding);
};

FileWriter.prototype.getTransformedLines = function (lines, transformer, isIOSDictFormat) {
    var valueToInsert = '';
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (!line.isEmpty()) {
            if (line.isComment()) {
                valueToInsert += transformer.transformComment(line.getComment());
            } else {
                valueToInsert += transformer.transformKeyValue(line.getKey(), line.getValue(), isIOSDictFormat);
            }
        }
        if (i != lines.length - 1) {
            valueToInsert += EOL;
        }
    }

    return valueToInsert;
}

var FakeWriter = function () {

};

FakeWriter.prototype.write = function (filePath, lines, transformer) {

};

module.exports = { File: FileWriter, Fake: FakeWriter };
