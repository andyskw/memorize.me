"use strict";

var config = null;
var log = null;
var mailSender = null;
var request = require("request");
var BusBoy = require("busboy");
var ResponseBuilder = require("../util/response-builder");
var promise = require("bluebird");
var speech = require('google-speech-api');


let initApplication = (conf, l) => {
    config = conf;
    log = l;

    return {
        post: {
            speechToText
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
        var opts = { filetype: 'mp3', key : api_key};

        var file = fileData.file;
        var filename = fileData.filename;
        var reqOptions = {
            url: url + "?output=" + output + "&lang=" + lang + "&key=" + api_key,
            headers: {
                'Content-type': ' audio/l16; rate=16000',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.77 Safari/535.7'
            }
        };
        file.pipe(request.post(reqOptions, function optionalCallback(err, httpResponse, body) {
            //var b = JSON.parse(body);
            res.send({
                data: body
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
        var found = false;
        var ft = null;
        /*
         allowed_filetypes.forEach(function (filetype) {
         if (!found && filename.indexOf("." + filetype, filename.length - filetype.length + 1) !== -1) {
         found = true;
         ft = filetype;
         }
         });
         */
        return deferred.resolve({file: file, filename: filename});

    });
    busboy.on('finish', function () {
        console.log("?");
    });
    req.pipe(busboy);
    return deferred.promise;
}