module.exports = class runtime {
    /*
     * Run script
     */
    constructor(durationMs, runEveryMs, callback){
        this.durationMs = durationMs;
        this.runEveryMs = runEveryMs;
        this.maxRun = durationMs / runEveryMs,
        this.runs = 0;
        
        this.callback = async () => {
            await callback();
        };

        //Run on script onitialization
        this.doJob();
    }

    async doJob(){
        var nextRun = this.runEveryMs,
            start = process.hrtime();

        await this.callback();

        nextRun -= process.hrtime(start)[1]/1000000;

        this.runs++;

        this.initializeTimeout(nextRun);
    }

    initializeTimeout(nextRun){
        if ( this.runs > this.maxRun ) {
            return;
        }

        console.log('Sleep for: '+(nextRun / 1000).toFixed(1)+ 's ['+this.runs+'/'+this.maxRun+']');


        setTimeout(() => {
            this.doJob();
        }, nextRun);
    }
}