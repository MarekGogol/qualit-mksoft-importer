var fs = require('fs'),
    moment = require('moment'),
    helpers = require('./helpers');

module.exports = {
    /*
     * Put info message into log
     */
    info(message){
        this.pushIntoLog('INFO', message);
    },

    /*
     * Put error message into log
     */
    error(message, error){
        this.pushIntoLog('ERROR', message, error);
    },

    /*
     * Put message into log
     */
    pushIntoLog(type, message, error){
        var prefix = '['+moment().format('DD.MM.Y H:mm:ss')+'] ['+type+'] ',
            error = error ? ("\n"+error) : '',
            output = prefix+message+error;

        try {
            fs.appendFileSync(helpers.getLogDir('/'+moment().format('Y-MM-DD')+'.log'), output+'\n');
        } catch (error){
            console.error(error);
        }

        console.log(output);
    },
};