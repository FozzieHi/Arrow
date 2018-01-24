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
    const guildLeft = msg.client.guilds.get(args.guildid);
    if (msg.dbGuild.blackListed === false || msg.dbGuild.blackListed === undefined) {
      await db.guildRepo.upsertGuild(msg.guild.id, { $set: { blackListed: true } });
    } else {
      await db.guildRepo.upsertGuild(msg.guild.id, { $set: { blackListed: false } });
    }
    await sender.reply('Successfully blacklisted the guild `' + guildLeft.name + '` (' + args.guildid + ').');
    return guildLeft.leave();
  }
}

module.exports = new LeaveGuild();
