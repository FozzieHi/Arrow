const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const db = require('../../database');
const ModerationService = require('../../services/ModerationService.js');

class EditLogs extends patron.Command {
  constructor() {
    super({
      names: ['toggleeditlogs', 'editlogs', 'editlog'],
      groupName: 'owner',
      description: 'Toggle Edit Logs.'
    });
  }

  async run(msg, args, sender) {
    const dbGuild = await db.guildRepo.getGuild(msg.guild.id);
    if ((dbGuild.editLogs === null) || (dbGuild.editLogs === undefined)) {
      await sender.reply('Successfully enabled edit logs.');
      await db.guildRepo.upsertGuild(msg.guild.id, { $set: { editLogs: true } });
      return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Toggle Edit Logs', Constants.banColor, '', msg.author, null, 'Status', 'Enabled');
    } else if (dbGuild.editLogs === true) {
      await sender.reply('Successfully disabled edit logs.');
      await db.guildRepo.upsertGuild(msg.guild.id, { $set: { editLogs: null } });
      return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Toggle Edit Logs', Constants.banColor, '', msg.author, null, 'Status', 'Disabled');
    }
    return sender.reply('Guild not found in Database (Code 502), please DM this error to **Fozzie#8606** with context.', { color: Constants.errorColor });
  }
}

module.exports = new EditLogs();
