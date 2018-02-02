const patron = require('patron.js');
const PromiseUtil = require('../../utility/PromiseUtil.js');
const Logger = require('../../utility/Logger.js');

class MassAnnounce extends patron.Command {
  constructor() {
    super({
      names: ['massannounce'],
      groupName: 'botowners',
      description: 'Mass announce a message accross all guilds.',
      args: [
        new patron.Argument({
          name: 'message',
          key: 'message',
          type: 'string',
          example: 'Announcement',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    const sortedGuilds = Array.from(msg.client.guilds.values()).sort((a, b) => b.memberCount - a.memberCount);
    await sender.reply('Successfully mass announced.');

    for (let i = 0; i < sortedGuilds.length; i++) {
      await PromiseUtil.delay(2500);
      const mainChannel = sortedGuilds[i].defaultChannel;
      if (mainChannel !== undefined) {
        mainChannel.send(args.message)
          .catch(async (err) => {
            await PromiseUtil.delay(60000);
          });
      }
      Logger.log('Mass announced | Name: ' + sortedGuilds[i].name + ' | Members: ' + sortedGuilds[i].memberCount + ' | Owner: ' + sortedGuilds[i].owner.user.tag, 'INFO');
    }
  }
}
module.exports = new MassAnnounce();
