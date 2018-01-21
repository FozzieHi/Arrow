const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');
const db = require('../../database');

class Unmute extends patron.Command {
  constructor() {
    super({
      names: ['unmute'],
      groupName: 'moderation',
      description: 'Unmute any member.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'Paul#3091'
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          defaultValue: '',
          example: 'Being good.',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    if (msg.dbGuild.roles.muted === null) {
      return sender.reply('Set a muted role with the `' + Constants.data.misc.prefix + 'setmute <Role>` command before you can unmute users.', { color: Constants.errorColor });
    } else if (args.member.roles.has(msg.dbGuild.roles.muted) === false) {
      return sender.reply('User is not muted.', { color: Constants.errorColor });
    }

    const role = msg.guild.roles.get(msg.dbGuild.roles.muted);

    if (role === undefined) {
      return sender.reply('Muted role has been deleted. Please set a new one with the `' + Constants.data.misc.prefix + 'setmute <Role>` command.', { color: Constants.errorColor });
    }

    await args.member.removeRole(role);
    await db.muteRepo.deleteMute(args.member.user.id, msg.guild.id);
    await sender.reply('Successfully unmuted ' + StringUtil.boldify(args.member.user.tag) + '.');
    await sender.dm(args.member.user, StringUtil.boldify(msg.author.tag) + ' has unmuted you' + (StringUtil.isNullOrWhiteSpace(args.reason) ? '.' : ' for the reason: ' + args.reason + '.'), { guild: msg.guild });
    return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Unmute', Constants.unmuteColor, args.reason, msg.author, args.member.user);
  }
}

module.exports = new Unmute();
