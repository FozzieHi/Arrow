const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const db = require('../../database');
const ModerationService = require('../../services/ModerationService.js');

class JoinLogs extends patron.Command {
  constructor() {
    super({
      names: ['toggledjoinlogs', 'togglejoinlogs', 'joinlogs', 'joinleavelogs', 'leavelogs', 'toggleleavelogs', 'toggledleavelogs'],
      groupName: 'administration',
      description: 'Toggle Join/Leave Logs.'
    });
  }

  async run(msg, args, sender) {
    const dbGuild = await db.guildRepo.getGuild(msg.guild.id);
    if ((dbGuild.joinLogs === null) || (dbGuild.joinLogs === undefined)) {
      await sender.reply('Successfully enabled Join/Leave logs.');
      await db.guildRepo.upsertGuild(msg.guild.id, { $set: { joinLogs: true } });
      return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Toggle Join/Leave Logs', Constants.banColor, '', msg.author, null, 'Status', 'Enabled');
    } else if (dbGuild.joinLogs === true) {
      await sender.reply('Successfully disabled Join/Leave logs.');
      await db.guildRepo.upsertGuild(msg.guild.id, { $set: { joinLogs: null } });
      return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Toggle Join/Leave Logs', Constants.banColor, '', msg.author, null, 'Status', 'Disabled');
    }
    return sender.reply('Guild not found in Database (Code 502), please DM this error to **Fozzie#0001** with context.', { color: Constants.errorColor });
  }
}

module.exports = new JoinLogs();
