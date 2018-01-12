const db = require('../database');
const ModerationService = require('../services/ModerationService.js');
const Constants = require('../utility/Constants.js');
const client = require('../singletons/client.js');

client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (oldMessage.author.bot) {
    return;
  }
  const guild = client.guilds.get(oldMessage.guild.id);
  const dbGuild = await db.guildRepo.getGuild(oldMessage.guild.id);
  if (dbGuild.editLogs === true) {
    return ModerationService.tryModLog(dbGuild, guild, 'Message Edit', Constants.warnColor, '', newMessage.author, null, 'Message Before', oldMessage.content, 'Message After', newMessage.content, 'Channel', newMessage.channel);
  }
});
