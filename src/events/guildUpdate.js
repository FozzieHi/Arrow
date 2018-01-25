const client = require('../singletons/client.js');
const Logger = require('../utility/Logger.js');
const Sender = require('../utility/Sender.js');
const Try = require('../utility/Try.js');
const db = require('../database');

client.on('guildUpdate', async (oldGuild, newGuild) => {
  (async () => {
    const mainChannel = newGuild.defaultChannel;
    const dbGuild = await db.guildRepo.getGuild(newGuild.id);
    if (dbGuild.blackListed === true) {
      await Try(Sender.send(mainChannel, 'Guild is blacklisted.'));
      return newGuild.leave();
    }
  })()
    .catch((err) => Logger.handleError(err));
});
