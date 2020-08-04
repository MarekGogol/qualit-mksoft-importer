const axios = require('axios'),
      fs = require('fs'),
      moment = require('moment'),
      helpers = require('./helpers/helpers');
      Logger = require('./helpers/Logger'),
      windows1250 = require('windows-1250');

module.exports = class mksoft {
    async initialize(){
        var response = await this.synchronizeOrders();

        Logger.info('Import ended');

        return response;
    }

    /*
     * Fetch new orders from server, and save them into directories
     */
    async synchronizeOrders(){
        //Bot desired directories
        this.bootDirs();

        try {
            var url = await this.getSyncUrl(),
                response = await axios.get(url);
        } catch (error){
            Logger.error('Could not fetch orders data from remote server.', error);

            return false;
        }

        //Import all orders from array
        for ( var key in response.data ) {
            this.importOrder(response.data[key]);
        }

        this.saveLastTimestamp(response.data);

        return true;
    }

    /*
     * Create necessary directories
     */
    bootDirs(){
        //Create temp directory if does not exists
        let tempDir = helpers.getTempDir();
        if (!fs.existsSync(tempDir)){
            fs.mkdirSync(tempDir);
        }

        //If destination directory does not exists
        if (fs.existsSync(process.env.DESTINATION_PATH) == false){

            if ( this.isDebug() === true ){
                fs.mkdirSync(process.env.DESTINATION_PATH);
            } else {
                throw 'Destination directory '+process.env.DESTINATION_PATH+' does not exists';
            }
        }
    }

    async getSyncUrl(){
        var host = process.env.APP_HOST,
            path = '/api/mksoft/sync/{date}',
            lastTimeFileName = helpers.getLastOrderFileName(),
            date;

        try {
            if ( this.isDebug() === false && fs.existsSync(lastTimeFileName) ) {
                date = await fs.readFileSync(lastTimeFileName).toString();
            } else {
                date = 'all';
            }
        } catch(error){
            Logger.error('Could not load timestamp file.', error);

            throw error;
        }

        return host+(path.replace('{date}', date));
    }

    /*
     * Save last timestamp of imported order into file,
     * This increment will be  used in the future to fetch only newest orders...
     */
    async saveLastTimestamp(orders){
        if ( orders.length == 0 ){
            return;
        }

        orders = Object.values(orders).sort((a, b) => {
            return moment(b.mksoft_date) - moment(a.mksoft_date);
        });

        try {
            await fs.writeFileSync(helpers.getLastOrderFileName(), orders[0].mksoft_date);
        } catch (error){
            return Logger.error('Could nod save last order ecosun date '+orders[0].mksoft_date, error);
        }
    }

    /*
     * Orders can be rewriten
     */
    isDebug(){
        return process.env.APP_DEBUG == 'true';
    }

    /*
     * Save order data into file in dest directory
     */
    async importOrder(data){
        var destPath = process.env.DESTINATION_PATH+'/sucty'+data.id+'.txt';

        if ( fs.existsSync(destPath) && this.isDebug() === false ) {
            Logger.info('Order '+data.id+' exists already.');

            return true;
        }

        try {
            let response = windows1250.encode(data.string);

            await fs.writeFileSync(destPath, response, 'ascii');

            Logger.info('Order '+data.id+' has been imported.');
        } catch (error) {
            Logger.error('Order '+data.id+' could not be imported.', error);
        }
    }
}