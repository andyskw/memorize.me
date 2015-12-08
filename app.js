"use strict";
var http = require("http");
var express = require('express');
var bodyparser = require("body-parser");

exports.startApplication = function (config, log) {
    if (config == null) {
        throw new Error("Missing configuration, application cannot be started without config!");
    }
    if (log == null) {
        throw new Error("Missing logger; application cannot be started without a proper logger.");
    }

    var app = express();
    var router = require("express").Router();
    router.get('/monitor', (req, res)=> {
        res.send({status: 1});
    });

    initApplication(config, app, router);

    http.createServer(app).listen(app.get('port'), function () {
        log.info("memorize.me API test started on port " + app.get('port'));
    }).on('error', function (err) {
        throw new Error("Error while starting Express. Shutting down the application.", err);
    });

};

function initApplication(config, app, router) {
    app.set('port', config.express.port);
    app.use(bodyparser.json());
    app.options("*", router);
    app.get("*", router);
    app.put("*", router);
    app.post("*", router);

}
