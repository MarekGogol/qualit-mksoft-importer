global.__basedir = __dirname;

//Bootstrap .env files
const dotenv = require('dotenv'),
     axios = require('axios');

//Setup dotenv
dotenv.config();

//Setup axios token
axios.defaults.headers.common = {
    'APP-AUTH-TOKEN': process.env.APP_TOKEN,
};

const mksoft = require('./src/mksoft.js');

new mksoft;