const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');

class Unban extends patron.Command {
  constructor() {
    super({
      names: ['unban'],
      groupName: 'moderation',
      description: 'Lift the ban hammer on any member.',
      botPermissions: ['BAN_MEMBERS'],
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'banneduser',
          example: 'Fredrick#4872'
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'Forgiven <3.',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    await msg.guild.unban(args.user);
    await sender.reply('Successfully unbanned ' + StringUtil.boldify(args.user.tag) + '.');
    await ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Unban', Constants.unbanColor, args.reason, msg.author, args.user);
    await sender.dm(args.user, StringUtil.boldify(msg.author.tag) + ' has unbanned you' + (StringUtil.isNullOrWhiteSpace(args.reason) ? '.' : ' for the reason: ' + args.reason + '.'), { guild: msg.guild });
  }
}

module.exports = new Unban();
