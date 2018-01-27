const patron = require('patron.js');
const db = require('../../database');

class SetAnnouncementsChannel extends patron.Command {
  constructor() {
    super({
      names: ['setannouncementchannel', 'setannouncementschannel', 'setannounce', 'announcechannel', 'setannouncechannel'],
      groupName: 'administration',
      description: 'Sets the announcements channel.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'Announcements',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    await db.guildRepo.upsertGuild(msg.guild.id, { $set: { 'channels.announcements': args.channel.id } });
    return sender.reply('Successfully set the announcement channel to ' + args.channel + '.');
  }
}

module.exports = new SetAnnouncementsChannel();
