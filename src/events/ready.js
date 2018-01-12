const Constants = require('../utility/Constants.js');
const Logger = require('../utility/Logger.js');
const client = require('../singletons/client.js');

client.on('ready', async () => {
  (async () => {
    await Logger.log('Shard #' + client.shard.id + ' has successfully connected.', 'INFO');
    await client.user.setGame(Constants.game);
  })()
    .catch((err) => Logger.handleError(err));
});
