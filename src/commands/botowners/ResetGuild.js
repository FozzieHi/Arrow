const db = require('../../database');
const patron = require('patron.js');

class Reset extends patron.Command {
  constructor() {
    super({
      names: ['resetguild'],
      groupName: 'botowners',
      description: 'Resets all Arrow user data in your server.'
    });
  }

  async run(msg, args, sender) {
    await sender.reply('Are you sure you wish to reset this guild\'s data Fozzie? Reply with "yes" to continue.');

    const filter = (x) => x.content.toLowerCase() === 'yes' && x.author.id === msg.author.id;
    const result = await msg.channel.awaitMessages(filter, { max: 1, time: 30000 });

    if (result.size === 1) {
      await db.guildRepo.deleteGuilds(msg.guild.id);
      return sender.reply('Successfully reset all Arrow Guild data in your guild.');
    }
  }
}

module.exports = new Reset();
