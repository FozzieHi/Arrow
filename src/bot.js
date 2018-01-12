const path = require('path');
const db = require('./database');
const client = require('./singletons/client.js');
const RequireAll = require('patron.js').RequireAll;
const Logger = require('./utility/Logger.js');
const credentials = require('./credentials.json');
const registry = require('./singletons/registry.js');

client.registry = registry;

RequireAll(path.join(__dirname, 'events'));

(async () => {
  await db.connect(credentials.mongodbConnectionURL);
  return client.login(credentials.token);
})()
  .catch((err) => Logger.handleError(err));
