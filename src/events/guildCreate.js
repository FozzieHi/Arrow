const Constants = require('../utility/Constants.js');
const client = require('../singletons/client.js');
const Logger = require('../utility/Logger.js');
const Sender = require('../utility/Sender.js');
const Try = require('../utility/Try.js');

client.on('guildCreate', async (guild) => {
  (async () => {
    const mainChannel = guild.mainChannel;

    if (mainChannel !== undefined) {
      return Try(Sender.send(mainChannel, 'Hey! I am Arrow, ya know, the slickest bot in town.\n\nJust wanted to let you know that you can use the `' + Constants.prefix +'help` command to get all the command info a man\'s heart could desire.\n\nIf you have any questions or concerns, you may always join the **Official Arrow Support Server:** ' + Constants.data.links.serverInvite + '.'));
    }
  })()
    .catch((err) => Logger.handleError(err));
});
