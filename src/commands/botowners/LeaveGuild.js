const patron = require('patron.js');

class LeaveGuild extends patron.Command {
  constructor() {
    super({
      names: ['leaveguild', 'leaveguildid', 'guildleave'],
      groupName: 'botowners',
      description: 'Sets the muted role.',
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
    await guildLeft.leave();
    await sender.reply('Successfully left the guild `' + guildLeft.name + '` (' + args.guildid + ').');
  }
}

module.exports = new LeaveGuild();
