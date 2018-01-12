const client = require('../singletons/client.js');
const Logger = require('../utility/Logger.js');

client.on('error', (err) => Logger.handleError(err));
