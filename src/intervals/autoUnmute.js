const db = require('../database');
const Constants = require('../utility/Constants.js');
const Sender = require('../utility/Sender.js');
const ModerationService = require('../services/ModerationService.js');

module.exports = async (client) => {
  client.setInterval(async () => {
    const mutes = await db.muteRepo.getMutes();

    for (let i = 0; i < mutes.length; i++) {
      if (mutes[i].mutedAt + mutes[i].muteLength > Date.now()) {
        continue;
      }

      await db.muteRepo.deleteById(mutes[i]._id);

      const guild = client.guilds.get(mutes[i].guildId);

      if (guild === undefined) {
        continue;
      }

      const member = guild.member(mutes[i].userId);

      if (member === null) {
        continue;
      }

      const dbGuild = await db.guildRepo.getGuild(guild.id);
      const role = guild.roles.get(dbGuild.roles.muted);

      if (role === undefined) {
        continue;
      }

      if (guild.me.hasPermission('MANAGE_ROLES') === false || role.position >= guild.me.highestRole.position) {
        continue;
      }

      await member.removeRole(role);
      await ModerationService.tryModLog(dbGuild, guild, 'Automatic Unmute', Constants.unmuteColor, '', null, member.user);
      await Sender.dmFields(member, 'Arrow has automatically unmuted you.', { guild: guild });
    }
  }, Constants.intervals.autoUnmute);
};
