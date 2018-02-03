const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const db = require('../../database');
const ModerationService = require('../../services/ModerationService.js');

class ToggleLottery extends patron.Command {
  constructor() {
    super({
      names: ['togglelottery', 'togglelotto'],
      groupName: 'administration',
      description: 'Toggles the Lottery in your server.'
    });
  }

  async run(msg, args, sender) {
    if ((msg.dbGuild.lottery === null) || (msg.dbGuild.lottery === undefined)) {
      await sender.reply('Successfully enabled the Lottery.');
      await db.guildRepo.upsertGuild(msg.guild.id, { $set: { lottery: true } });
      return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Toggled Lottery', Constants.banColor, '', msg.author, null, 'Status', 'Enabled');
    } else if (msg.dbGuild.lottery === true) {
      await sender.reply('Successfully disabled the Lottery.');
      await db.guildRepo.upsertGuild(msg.guild.id, { $set: { lottery: false } });
      return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Toggled Lottery', Constants.banColor, '', msg.author, null, 'Status', 'Disabled');
    }
    return sender.reply('Guild not found in Database (Code 502), please DM this error to **Fozzie#0001** with context.', { color: Constants.errorColor });
  }
}

module.exports = new ToggleLottery();
