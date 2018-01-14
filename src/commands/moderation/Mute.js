const patron = require('patron.js');
const db = require('../../database');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Mute extends patron.Command {
  constructor() {
    super({
      names: ['mute', 'silence'],
      groupName: 'moderation',
      description: 'Mute any user.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'Badboy#4925',
          preconditions: ['nomoderator']
        }),
        new patron.Argument({
          name: 'number of hours',
          key: 'hours',
          type: 'float',
          example: '48',
          defaultValue: Constants.mute.defaultLength
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          defaultValue: '',
          example: 'Breaking rules.',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    const role = msg.guild.roles.get(msg.dbGuild.roles.muted);
    const formattedHours = args.hours + ' hour' + (args.hours === 1 ? '' : 's');

    if (msg.dbGuild.roles.muted === null) {
      return sender.reply('Set a muted role with the `' + Constants.prefix + 'setmute <Role>` command before you can mute users.', { color: Constants.errorColor });
    } else if (args.member.roles.has(msg.dbGuild.roles.muted)) {
      return sender.reply('User already muted.', { color: Constants.errorColor });
    }

    if (role === undefined) {
      return sender.reply('Muted role has been deleted. Please set a new one with the `' + Constants.prefix + 'setmute <Role>` command.', { color: Constants.errorColor });
    }

    await args.member.addRole(role);
    await sender.reply('Successfully muted ' +StringUtil.boldify(args.member.user.tag) + ' for ' + formattedHours + '.');
    await db.muteRepo.insertMute(args.member.id, msg.guild.id, NumberUtil.hoursToMs(args.hours));
    await sender.dm(args.member.user, StringUtil.boldify(msg.author.tag) + ' has muted you for ' + formattedHours + (StringUtil.isNullOrWhiteSpace(args.reason) ? '.' : ' with the reason:'), { guild: msg.guild });
    await db.userRepo.upsertUser(args.member.id, msg.guild.id, { $inc: { mutes: 1 } });
    return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Mute', Constants.muteColor, args.reason, msg.author, args.member.user, 'Length', formattedHours);
  }
}

module.exports = new Mute();
