const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const db = require('../../database');
const ModerationService = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');

class Kick extends patron.Command {
  constructor() {
    super({
      names: ['kick'],
      groupName: 'moderation',
      description: 'Kick any member.',
      botPermissions: ['KICK_MEMBERS'],
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'Fozzie#8606',
          preconditions: ['nomoderator']
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'Bad boy!',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    await args.member.kick(args.reason);
    await sender.reply('Successfully kicked ' + args.member.user.tag.boldify() + '.');
    await sender.dm(args.member.user, StringUtil.boldify(msg.author.tag) + ' has kicked you' + (StringUtil.isNullOrWhiteSpace(args.reason) ? '.' : ' for the reason: ' + args.reason + '.'), { guild: msg.guild });
    await db.userRepo.upsertUser(args.member.id, msg.guild.id, { $inc: { kicks: 1 } });
    return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Kick', Constants.kickColor, args.reason, msg.author, args.member.user);
  }
}

module.exports = new Kick();
