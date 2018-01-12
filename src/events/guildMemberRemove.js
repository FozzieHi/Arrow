const ModerationService = require('../services/ModerationService.js');
const Constants = require('../utility/Constants.js');
const db = require('../database');
const client = require('../singletons/client.js');

client.on('guildMemberRemove', async (member) => {
  const guild = client.guilds.get(member.guild.id);
  const dbGuild = await db.guildRepo.getGuild(member.guild.id);
  return ModerationService.tryModLog(dbGuild, guild, 'Member Leave', Constants.kickColor, '', member.user, null);
});
