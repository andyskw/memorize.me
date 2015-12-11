"use strict";

var config = null;
var log = null;
var mailSender = null;
var request = require("request");
var BusBoy = require("busboy");
var ResponseBuilder = require("../util/response-builder");
var promise = require("bluebird");
var speech = require('google-speech-api');
var textHelper = require("../util/textHelper");


let initApplication = (conf, l) => {
    config = conf;
    log = l;

    return {
        post: {
            speechToText,
            textToText
        }
    };
};

let speechToText = (req, res) => {
    "use strict";

    var url = config.google.speech.url;
    var output = config.google.speech.output;
    var lang = config.google.speech.lang;
    var api_key = config.google.api_key;

    downloadFileData(req).then((fileData) => {
        var file = fileData.file;
        var filename = fileData.filename;
        var reqOptions = {
            url: url + "?output=" + output + "&lang=" + lang + "&key=" + api_key,
            headers: {
                'Content-type': ' audio/l16; rate=16000',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.77 Safari/535.7'
            }
        };
        console.log("File pipe started");
        file.pipe(request.post(reqOptions, function optionalCallback(err, httpResponse, body) {
            console.log("response received from google");
            if (err) {
                console.error("Error while contacting google");
                return res.json({status: 0, message: "GOOGLE_ERROR"});
            }
            if (body.charAt(0) === "<") {
                console.error("Response from google:");
                console.error(body);
                return res.json({status: 0, message: "GOOGLE_ERROR_INVALID_RESP"});
            }
            var b = body.substr(14); //removing the first result...
            b = cleanUpGoogleResponse(b);
            try {
                b = JSON.parse(b);
            } catch (err) {
                console.err("Error while parsing Google response.", err);
                console.err("our resp to be parsed was:" + b);
                console.err("Original response was: " + httpResponse);
                return res.json({status: 0, message: "PARSE_ERROR"});
            }

            res.json({
                status: 1,
                data: b
            });

        }));
    });
};


module.exports = initApplication;

function downloadFileData(req) {
    var allowed_filetypes = ['wav'];
    var busboy = new BusBoy({headers: req.headers});
    var deferred = promise.defer();
    var files = [];
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log("File receive started - ish?");
        var found = false;
        var ft = null;
        return deferred.resolve({file: file, filename: filename});

    });
    busboy.on('finish', function () {
        console.log("Busboy finish event");
    });
    req.pipe(busboy);
    return deferred.promise;
};

function textToText(req, res) {
    var text = req.body.text.toLowerCase();
    var start = req.body.startTrigger ? req.body.startTrigger : "david";
    var end = req.body.endTrigger ? req.body.endTrigger : "thanks";
    var todos = textHelper.getTodosFromText(text, start, end);
    res.json({status: 1, data: {todos: todos}});
};

function cleanUpGoogleResponse(response) {
    var r = replaceAll(response, "\n", "");
    while (r != r.replace("\\", "")) {
        r = r.replace('\\', "");

    }
    ;
    return r;

}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}