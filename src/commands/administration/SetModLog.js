const patron = require('patron.js');
const db = require('../../database');

class SetModLog extends patron.Command {
  constructor() {
    super({
      names: ['setmodlog', 'modlog', 'logs', 'setmodlog', 'setmodlogs', 'setlog', 'setlogs', 'sml'],
      groupName: 'administration',
      description: 'Sets the moderation log channel.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'Logs',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    await db.guildRepo.upsertGuild(msg.guild.id, { $set: { 'channels.modLog': args.channel.id } });
    return sender.reply('Successfully set the moderation log channel to ' + args.channel + '.');
  }
}

module.exports = new SetModLog();
