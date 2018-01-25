const patron = require('patron.js');
const db = require('../../database');

class LeaveGuild extends patron.Command {
  constructor() {
    super({
      names: ['bl', 'blacklist', 'blacklistguild', 'blguild'],
      groupName: 'botowners',
      description: 'Blacklists a guild from Arrow.',
      guildOnly: false,
      args: [
        new patron.Argument({
          name: 'guild id',
          key: 'guildid',
          type: 'string',
          example: '356428177775788032'
        })
      ]
    });
  }

  async run(msg, args, sender) {
    const guildLeft = await msg.client.guilds.get(args.guildid);
    const guildDB = await db.guildRepo.getGuild(msg.guild.id);
    if (guildDB.blackListed === false || guildDB.blackListed === undefined) {
      await db.guildRepo.upsertGuild(msg.guild.id, { $set: { blackListed: true } });
      await sender.reply('Successfully blacklisted the guild `' + guildLeft.name + '` (' + args.guildid + ').');
    } else {
      await db.guildRepo.upsertGuild(msg.guild.id, { $set: { blackListed: false } });
      await sender.reply('Successfully unblacklisted the guild `' + guildLeft.name + '` (' + args.guildid + ').');
    }
    return guildLeft.leave();
  }
}

module.exports = new LeaveGuild();
