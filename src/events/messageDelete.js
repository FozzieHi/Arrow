const db = require('../database');
const ModerationService = require('../services/ModerationService.js');
const Constants = require('../utility/Constants.js');
const client = require('../singletons/client.js');

client.on('messageDelete', async (message) => {
  if (message.author.bot) {
    return;
  }
  const guild = client.guilds.get(message.guild.id);
  const dbGuild = await db.guildRepo.getGuild(message.guild.id);
  if (dbGuild.deleteLogs === true) {
    return ModerationService.tryModLog(dbGuild, guild, 'Message Deletion', Constants.kickColor, '', message.author, null, 'Message Content', message.content, 'Channel', message.channel);
  }
});
