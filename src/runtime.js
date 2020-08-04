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
            return await callback();
        };

        //Run on script onitialization
        this.doJob();
    }

    async doJob(){
        var nextRun = this.runEveryMs,
            start = process.hrtime(),
            response = await this.callback();

        //If response from callback in runtime is false
        //We want add delay one minute for next request
        if ( response === false ){
            let delayInWrongRequest = 120 * 1000; //add delay 1 minute, if request from server was wrong

            nextRun += delayInWrongRequest;

            console.log('Adding delay ', delayInWrongRequest, 'ms, because of wrong request.');
        }

        //Add delay of previous work duration
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