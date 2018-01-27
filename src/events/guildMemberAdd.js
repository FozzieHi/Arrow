const ModerationService = require('../services/ModerationService.js');
const Constants = require('../utility/Constants.js');
const db = require('../database');
const client = require('../singletons/client.js');
const StringUtil = require('../utility/StringUtil.js');

client.on('guildMemberAdd', async (member) => {
  const guild = client.guilds.get(member.guild.id);
  const dbGuild = await db.guildRepo.getGuild(member.guild.id);
  if (!StringUtil.isNullOrWhiteSpace(dbGuild.roles.join)) {
    const role = guild.roles.get(dbGuild.roles.join);
    member.addRole(role);
  }
  if (dbGuild.roles.muted !== null && await db.muteRepo.anyMute(member.id, member.guild.id) === true) {
    const role = member.guild.roles.get(dbGuild.roles.muted);

    if (!(role === undefined || member.guild.me.hasPermission('MANAGE_ROLES') === false || role.position >= member.guild.me.highestRole.position)) {
      await member.addRole(role);
    }
  }
  if (dbGuild.joinLogs !== false) {
    return ModerationService.tryModLog(dbGuild, guild, 'Member Join', Constants.unmuteColor, '', member.user, null);
  }
});
