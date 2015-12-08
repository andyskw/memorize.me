"use strict"

var app = require("./app");
var config = require('config');
var log4js = require("log4js");
log4js.configure(config.get("log4js"));
var log = log4js.getLogger(config.get("log4js.default_logger"));


app.startApplication(config, log);