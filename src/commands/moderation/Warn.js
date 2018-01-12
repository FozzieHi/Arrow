const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');
const db = require('../../database');
const StringUtil = require('../../utility/StringUtil.js');

class Warn extends patron.Command {
  constructor() {
    super({
      names: ['warn'],
      groupName: 'moderation',
      description: 'Warn any member.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'John#5974',
          preconditions: ['nomoderator']
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'Being stupid.',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    await sender.reply('Successfully warned ' + StringUtil.boldify(args.member.user.tag) + '.');
    await sender.dm(args.member.user, StringUtil.boldify(msg.author.tag) + ' has warned you' + (StringUtil.isNullOrWhiteSpace(args.reason) ? '.' : ' for the reason: ' + args.reason + '.'), { guild: msg.guild });
    await db.userRepo.upsertUser(args.member.id, msg.guild.id, { $inc: { warns: 1 } });
    return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Warn', Constants.warnColor, args.reason, msg.author, args.member.user);
  }
}

module.exports = new Warn();
