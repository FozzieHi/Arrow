const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const db = require('../../database');
const ModerationService = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');

class Ban extends patron.Command {
  constructor() {
    super({
      names: ['ban'],
      groupName: 'moderation',
      description: 'Ban any user.',
      botPermissions: ['BAN_MEMBERS'],
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'Fredrick#4872',
          preconditions: ['nomoderator']
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'Abusing permissions.',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    if (msg.guild.members.has(args.member.id)) {
      await sender.dm(args.member.user, StringUtil.boldify(msg.author.tag) + ' has banned you' + (StringUtil.isNullOrWhiteSpace(args.reason) ? '.' : ' for the reason: ' + args.reason + '.'), { guild: msg.guild });
    }

    await msg.guild.ban(args.member);
    await sender.reply('Successfully banned ' + StringUtil.boldify(args.member.user.tag) + '.');
    await db.userRepo.upsertUser(args.member.id, msg.guild.id, { $inc: { bans: 1 } });
    return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Ban', Constants.banColor, args.reason, msg.author, args.member.user);
  }
}

module.exports = new Ban();
