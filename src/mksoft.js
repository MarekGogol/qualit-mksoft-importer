const axios = require('axios'),
      fs = require('fs'),
      moment = require('moment'),
      helpers = require('./helpers/helpers');
      Logger = require('./helpers/Logger');

module.exports = class mksoft {
    /*
     * Run script
     */
    constructor(){
        this.synchronizeOrders();

        Logger.info('Import eneded');
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
            Logger.error('Could not fetch orders data.', error);

            throw error;
        }

        for ( var key in response.data ) {
            this.importOrder(response.data[key]);
        }

        this.saveLastTimestamp(response.data);
    }

    /*
     * Create necessary directories
     */
    bootDirs(){
        let tempDir = helpers.getTempDir();

        if (!fs.existsSync(tempDir)){
            fs.mkdirSync(tempDir);
        }

        //We we want create destination directory, we can uncomment this
        // if (fs.existsSync(process.env.DESTINATION_PATH) == false){
        //     throw 'Destination directory '+process.env.DESTINATION_PATH+' does not exists';
        // }
    }

    async getSyncUrl(){
        var host = process.env.APP_HOST,
            path = '/admin/mksoft/sync/30/{date}',
            lastTimeFileName = helpers.getLastOrderFileName(),
            date;

        try {
            if ( fs.existsSync(lastTimeFileName) ) {
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
     * Save last timestamp of order into file,
     * then this increment will be used to fetch only newest orders
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

    async importOrder(data){
        var destPath = process.env.DESTINATION_PATH+'/sucty'+data.id+'.txt';

        if ( fs.existsSync(destPath) ) {
            Logger.info('Order '+data.id+' exists already.');

            return true;
        }

        try {
            await fs.writeFileSync(destPath, data.string);

            Logger.info('Order '+data.id+' has been imported.');
        } catch (error) {
            Logger.error('Order '+data.id+' could not be imported.', error);
        }
    }
}