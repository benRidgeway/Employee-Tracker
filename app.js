const dotenv = require('dotenv');
dotenv.config();

const Session = require('./lib/Session');

new Session().initializeSession();