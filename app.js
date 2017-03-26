var express = require('express');
var app = express();
var scripts = require('./lib/scripts');
var bodyParser = require('body-parser');

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static('./client'));
app.use(bodyParser.json());

app.get('/scripts', function (req, res) {
    scripts.getScripts((err, result)=> {
        if (err) {
            return res.status(500).send({error: err.message});
        }
        res.send(result);
    });
});

app.post('/register', function (req, res) {
    if (req.body.script && req.body.scriptName) {
        scripts.addScript(req.body.scriptName, req.body.script, (err, result)=> {
            if (err) {
                return res.status(500).send({error: err.message});
            }
            res.send(result);
        });
    }else{
        res.status(500).send({error: 'please supply script name and script parameters'});
    }
});

app.put('/execute/:scriptName', function (req, res) {
    scripts.executeScript(req.params.scriptName, (err, result)=> {
        if (err) {
            return res.status(500).send({error: err.message});
        }
        res.send(result);
    });
});

app.delete('/:scriptName', function (req, res) {
    scripts.removeScript(req.params.scriptName, (err, result)=> {
        if (err) {
            return res.status(500).send({error: err.message});
        }
        res.send(result);
    });
});

app.listen(process.env.port || 3000);

