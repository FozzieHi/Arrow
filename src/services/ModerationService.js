const Constants = require('../utility/Constants.js');
const db = require('../database');
const sender = require('../utility/Sender.js');
const StringUtil = require('../utility/StringUtil.js');

class ModerationService {
  getPermLevel(dbGuild, member) {
    if (member.guild.ownerID === member.id) {
      return 3;
    }

    let permLevel = 0;

    for (const modRole of dbGuild.roles.mod.sort((a, b) => a.permissionLevel - b.permissionLevel)) {
      if (member.guild.roles.has(modRole.id) && member.roles.has(modRole.id)) {
        permLevel = modRole.permissionLevel;
      }
    }

    return member.hasPermission('ADMINISTRATOR') === true && permLevel < 2 ? 2 : permLevel;
  }

  async tryModLog(dbGuild, guild, action, color, reason = '', moderator = null, user = null, extraInfoType = '', extraInfo = '', extraInfoType2 = '', extraInfo2 = '', extraInfoType3 = '', extraInfo3 = '') {
    if (dbGuild.channels.modLog === null) {
      return false;
    }

    const channel = guild.channels.get(dbGuild.channels.modLog);
    var caseNum = dbGuild.caseNumber;

    if (channel === undefined) {
      return false;
    }

    const options = {
      color: color,
      footer: {
        text: 'Case #' + caseNum
      },
      timestamp: true
    };

    if (moderator !== null) {
      options.author = {
        name: moderator.tag,
        icon: moderator.avatarURL,
        URL: Constants.botInvite
      };
    }

    let description = '**Action:** ' + action + '\n';

    if (user !== null) {
      description += '**User:** ' + user.tag + ' (' + user.id + ')\n';
    }

    if (StringUtil.isNullOrWhiteSpace(reason) === false) {
      description += '**Reason:** ' + reason + '\n';
    }

    if (StringUtil.isNullOrWhiteSpace(extraInfoType) === false) {
      description += '**'+ extraInfoType + ':** ' + extraInfo + '\n';
    }

    if (StringUtil.isNullOrWhiteSpace(extraInfoType2) === false) {
      description += '**'+ extraInfoType2 + ':** ' + extraInfo2 + '\n';
    }

    if (StringUtil.isNullOrWhiteSpace(extraInfoType3) === false) {
      description += '**'+ extraInfoType3 + ':** ' + extraInfo3 + '\n';
    }

    await db.guildRepo.upsertGuild(dbGuild.guildId, { $inc: { caseNumber: 1 } });
    return sender.send(channel, description, options);
  }
  async trySendReport(dbGuild, guild, reportedUser, reporter, reason, color) {
    if (dbGuild.channels.reports === null) {
      return false;
    }

    const channel = guild.channels.get(dbGuild.channels.reports);

    if (channel === undefined) {
      return false;
    }

    const options = {
      color: color,
      footer: {
        text: 'Report #' + dbGuild.reportNumber
      },
      timestamp: true
    };

    if (reporter !== null) {
      options.author = {
        name: reporter.tag,
        icon: reporter.avatarURL,
        URL: Constants.botInvite
      };
    }

    let description = '**Report ID:** ' + dbGuild.reportNumber + '\n';

    if (reportedUser !== null) {
      description += '**User:** ' + reportedUser.tag + ' (' + reportedUser.id + ')\n';
    }

    if (StringUtil.isNullOrWhiteSpace(reason) === false) {
      description += '**Reason:** ' + reason + '\n';
    }

    await db.guildRepo.upsertGuild(dbGuild.guildId, { $inc: { reportNumber: 1 } });
    return sender.send(channel, description, options);
  }
}

module.exports = new ModerationService();
