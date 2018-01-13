const ModerationService = require('../services/ModerationService.js');
const Constants = require('../utility/Constants.js');
const db = require('../database');
const client = require('../singletons/client.js');

client.on('guildMemberAdd', async (member) => {
  const guild = client.guilds.get(member.guild.id);
  const dbGuild = await db.guildRepo.getGuild(member.guild.id);
  if (!StringUtil.isNullOrWhiteSpace(dbGuild.roles.join)) {
    const role = guild.roles.get(dbGuild.roles.join);
    member.addRole(role);
  }
  return ModerationService.tryModLog(dbGuild, guild, 'Member Join', Constants.unmuteColor, '', member.user, null);
});
