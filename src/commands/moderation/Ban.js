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
          name: 'user',
          key: 'user',
          type: 'user',
          example: 'Fredrick#4872'
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
    if (msg.guild.members.has(args.user.id)) {
      const member = msg.guild.members.get(args.user.id);
      if (ModerationService.getPermLevel(msg.dbGuild, member) !== 0) {
        return sender.reply('You may not use this command on a moderator.', { color: Constants.errorColor });
      }
      await db.userRepo.upsertUser(args.user.id, msg.guild.id, { $inc: { bans: 1 } });
      await sender.dm(args.user, StringUtil.boldify(msg.author.tag) + ' has banned you' + (StringUtil.isNullOrWhiteSpace(args.reason) ? '.' : ' for the reason: ' + args.reason + '.'), { guild: msg.guild });
    }

    await msg.guild.ban(args.user);
    await sender.reply('Successfully banned ' + StringUtil.boldify(args.user.tag) + '.');
    return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Ban', Constants.banColor, args.reason, msg.author, args.user);
  }
}

module.exports = new Ban();
