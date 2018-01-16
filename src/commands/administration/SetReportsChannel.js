const patron = require('patron.js');
const db = require('../../database');

class SetModLog extends patron.Command {
  constructor() {
    super({
      names: ['setrepots', 'setreportchannel', 'setreportschannel'],
      groupName: 'administration',
      description: 'Sets the reports channel.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'Reports',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    await db.guildRepo.upsertGuild(msg.guild.id, { $set: { 'channels.reports': args.channel.id } });
    await db.guildRepo.upsertGuild(msg.guild.id, { $set: { deleteLogs: null } });
    return sender.reply('Successfully set the reports channel to ' + args.channel + '. Also disabled delete logs, if you do not have public logs feel free to enable them with ?deletelogs.');
  }
}

module.exports = new SetModLog();
