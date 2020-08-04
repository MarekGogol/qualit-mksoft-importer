global.__basedir = __dirname;

//Bootstrap .env files
const dotenv = require('dotenv'),
     axios = require('axios');

//Setup dotenv
dotenv.config();

//Setup axios token
axios.defaults.headers.common = {
    'APP-AUTH-ID': process.env.APP_USER_ID,
    'APP-AUTH-TOKEN': process.env.APP_TOKEN,
};

const mksoft = require('./src/mksoft.js'),
      runtime = require('./src/runtime.js');

//Run script for given duration
new runtime(
    process.env.APP_RUNTIME_DURATION_SECONDS * 1000,
    process.env.APP_RUNTIME_RUN_EVERY_SECONDS * 1000,
    async () => {
        return await (new mksoft).initialize();
    }
);