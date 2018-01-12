const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Stats extends patron.Command {
  constructor() {
    super({
      names: ['statistics', 'stats'],
      groupName: 'general',
      description: 'Statistics about Arrow.',
      guildOnly: false
    });
  }

  async run(msg, args, sender) {
    const uptime = NumberUtil.msToTime(msg.client.uptime);

    let users = 0;

    for (const guild of msg.client.guilds.values()) {
      users += guild.memberCount;
    }

    await sender.dmFields(
      [
        'Author', 'Fozzie#8606', 'Guilds', msg.client.guilds.size,
        'Users', users, 'Uptime', 'Days: ' + uptime.days + '\nHours: '+ uptime.hours + '\nMinutes: ' + uptime.minutes
      ]);

    if (msg.channel.type !== 'dm') {
      return sender.reply('You have been DMed with all of the statistics.');
    }
  }
}

module.exports = new Stats();
