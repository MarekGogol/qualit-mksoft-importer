module.exports = {
    getStorageDir(path){
        return __basedir+'/storage'+(path ? '/'+path : '');
    },

    /*
     * Temporary directory
     */
    getTempDir(path){
        return this.getStorageDir('/tmp'+(path ? '/'+path : ''));
    },

    /*
     * Log directory
     */
    getLogDir(path){
        return this.getStorageDir('/logs'+(path ? '/'+path : ''));
    },

    /*
     * File with last order timestamp
     */
    getLastOrderFileName(){
        return this.getTempDir('/last_order.txt');
    },
}