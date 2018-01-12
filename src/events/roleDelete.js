const db = require('../database');
const client = require('../singletons/client.js');
const Logger = require('../utility/Logger.js');

client.on('roleDelete', async (role) => {
  (async () => {
    const dbGuild = await db.guildRepo.getGuild(role.guild.id);

    if (dbGuild.roles.rank.some((v) => v.id === role.id)) {
      return db.guildRepo.upsertGuild(role.guild.id, new db.updates.Pull('roles.rank', { id: role.id }));
    }
  })()
    .catch((err) => Logger.handleError(err));
});
