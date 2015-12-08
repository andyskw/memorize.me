var nodemailer = require("nodemailer");

var transporter;

module.exports = function (config, log) {

    if (transporter != null) {
        return transporter;
    }

    var tr = null;
    if (config.nodemailer.transporter == "sendmail") {
        tr = require('nodemailer-sendmail-transport');
    } else if (config.nodemailer.transporter == "smtp") {
        tr = require("nodemailer-smtp-transport");
    } else {
        log.warn("Unknown transporter was set in the application configuration:", config.nodemailer.transporter);
        log.warn("The following transporters are supported: 'sendmail', 'smtp'. Falling back to sendmail.");
        tr = require('nodemailer-sendmail-transport');
    }

    var options = config.nodemailer.options;
    if (typeof options === "string") {
        options = JSON.parse(options);
        if (typeof options === "string") {
            options = JSON.parse(options);
        }
    }

    transporter = nodemailer.createTransport(new tr(options));

    return transporter;

};