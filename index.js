global.__basedir = __dirname;

//Bootstrap .env files
const dotenv = require('dotenv');

//Setup dotenv
dotenv.config();

const mksoft = require('./src/mksoft.js');

new mksoft;