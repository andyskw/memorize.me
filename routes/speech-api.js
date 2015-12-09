"use strict";

var config = null;
var log = null;
var mailSender = null;


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

    res.send({
        data: {
            alternatives: [{
                text: "Almafa to do kortefa",
                confidence: 0.99
            }, {text: "Almafa do me kortefa"}]
        }
    });
};


module.exports = initApplication;
