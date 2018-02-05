const db = require('../../database');
const patron = require('patron.js');
const ModerationService = require('../../services/ModerationService.js');
const Constants = require('../../utility/Constants.js');

class Reset extends patron.Command {
  constructor() {
    super({
      names: ['reset'],
      groupName: 'botowners',
      description: 'Resets all Arrow user data in your server.'
    });
  }

  async run(msg, args, sender) {
    await sender.reply('Are you sure you wish to reset all Arrow user related data within your server? Reply with "yes" to continue.');

    const filter = (x) => x.content.toLowerCase() === 'yes' && x.author.id === msg.author.id;
    const result = await msg.channel.awaitMessages(filter, { max: 1, time: 30000 });

    if (result.size === 1) {
      await db.userRepo.deleteUsers(msg.guild.id);
      await sender.reply('Successfully reset all Arrow data in your guild.');
      return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Reset Guild Data', Constants.banColor, null, msg.author);
    }
  }
}

module.exports = new Reset();
