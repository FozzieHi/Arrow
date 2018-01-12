const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const db = require('../../database');
const ModerationService = require('../../services/ModerationService.js');

class EditLogs extends patron.Command {
  constructor() {
    super({
      names: ['deletelogs', 'deletelog', 'toggledeletelogs'],
      groupName: 'owner',
      description: 'Toggle Edit Logs.'
    });
  }

  async run(msg, args, sender) {
    const dbGuild = await db.guildRepo.getGuild(msg.guild.id);
    if ((dbGuild.deleteLogs === null) || (dbGuild.deleteLogs === undefined)) {
      await sender.reply('Successfully enabled delete logs.');
      await db.guildRepo.upsertGuild(msg.guild.id, { $set: { deleteLogs: true } });
      return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Toggle Delete Logs', Constants.banColor, '', msg.author, null, 'Status', 'Enabled');
    } else if (dbGuild.deleteLogs === true) {
      await sender.reply('Successfully disabled delete logs.');
      await db.guildRepo.upsertGuild(msg.guild.id, { $set: { deleteLogs: null } });
      return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Toggle Delete Logs', Constants.banColor, '', msg.author, null, 'Status', 'Disabled');
    }
    return sender.reply('Guild not found in Database (Code 502), please DM this error to **Fozzie#8606** with context.', { color: Constants.errorColor });
  }
}

module.exports = new EditLogs();
