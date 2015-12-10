var MailSender = require("../util/mailsender");
var moment = require("moment");

var config = null;
var log = null;
var mailSender = null;

postEmail = (req, res) => {
    if (mailSender == null) {
        mailSender = new MailSender(config, log);
    }
    var body = req.body;
    var email = body.email;
    var todos = body.todos ? body.todos : [];


    var mailOptions = {
        from: config.nodemailer.from, // sender address
        to: email, // list of receivers
        subject: 'meeting note - ' + moment().format('DD/MM'), // Subject line
        text: _getEmailTexts('text', todos), // plaintext body
        html: _getEmailTexts('html', todos) // html body
    };
    mailSender.sendMail(mailOptions, function (err, ok) {
        if (err) {
            log.error("Error while sending email.");
            log.error(err);
            res.json({status: 0});
        } else {
            log.info("E-mail sent.");
            log.debug(ok);
            res.json({status: 1});
        }

    });
};

initApplication = (conf, l) => {
    config = conf;
    log = l;

    return {
        post: {
            postEmail
        }
    };
};

module.exports = initApplication;

var _getEmailTexts = (type, todos) => {
    "use strict";
    var br = type == 'html' ? "<br />" : '\n' ;
    var todoList = todos.join(`${br} - [ ] `);
    var date = moment().format('h:mm MM.dd.YYYY');
    return `Here is your meeting note created at ${date}.${br}${br}  [ ] ${todoList}`;
};