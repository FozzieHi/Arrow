const Logger = require('../utility/Logger.js');
const client = require('../singletons/client.js');

client.on('reconnect', () => {
  return Logger.log('Attempting to reconnect...', 'INFO');
});
