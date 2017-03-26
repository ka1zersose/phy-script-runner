var _ = require('underscore'),
    fs = require('fs');

var scripts = [];

function isExists(scriptName) {
    var element = scripts.find((element)=> {
        return (element.name === scriptName);
    });
    return (element !== undefined);
}

function removeFromScripts(scriptName) {
    var index = _.findIndex(scripts, (elem)=> {
        if (elem.name === scriptName) {
            return true;
        }
    });
    if (index !== -1) {
        scripts.splice(index, 1);
    }
    return;
}

function saveScript(scriptName, script, callback) {
    var path = '/tmp/' + scriptName;
    fs.writeFile(path, script, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, path);
    });
}

function deleteScript(scriptName, callback) {
    var path = '/tmp/' + scriptName;
    fs.unlink(path, callback);
}

module.exports = {
    getScripts: function (callback){
        callback(null, scripts);
    },

    addScript: function (scriptName, script, callback) {
        if (isExists(scriptName)) {
            return callback(new Error('script already exists'));
        }
        saveScript(scriptName, script, (err, path)=> {
            if (err) {
                return callback(err);
            }
            scripts.push({name: scriptName, scriptPath: path});
            callback(null, {status: 'saved'});
        });
    },

    removeScript: function (scriptName, callback) {
        if (!isExists(scriptName)) {
            return callback(new Error('script does not exists'));
        }
        deleteScript(scriptName, function () {
            removeFromScripts(scriptName);
        });
        return callback(null, {status: 'success'});
    },

    executeScript: function (scriptName, callback) {
        if (!isExists(scriptName)) {
            return callback(new Error('script does not exists'));
        }
        var output = '', errOutput = '';
        var element = scripts.find((element)=> {
            return (element.name === scriptName);
        });
        var python = require('child_process').exec('python ' + element.scriptPath, {timeout: 3000}, (error,stdout,stderr)=>{
            output += stdout;
            errOutput += stderr;
            if (error){
                return callback(null, {code: error.code, stdOut: output, stdErr: errOutput});
            }
            callback(null, {code: 0, stdOut: output, stdErr: errOutput});
        });
    }
}