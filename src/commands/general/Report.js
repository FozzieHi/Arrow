const db = require('../../database');
const patron = require('patron.js');
const ModerationService = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');
const Constants = require('../../utility/Constants.js');

class Report extends patron.Command {
  constructor() {
    super({
      names: ['report'],
      groupName: 'general',
      description: 'Report anyone.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'Fozzie#8606'
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          defaultValue: '',
          example: 'Verbal abuse',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    const channel = msg.guild.channels.get(msg.dbGuild.channels.reports);
    if (channel === undefined || channel === null) {
      return sender.reply('You must set the reports channel before reporting. Use ?setreportchannel [Channel] to set it.', { color: Constants.errorColor });
    }
    await ModerationService.trySendReport(msg.dbGuild, msg.guild, args.member.user, msg.author, args.reason, Constants.banColor);
    await db.userRepo.upsertUser(args.member.id, msg.guild.id, { $inc: { reports: 1 } });
    const reply = await sender.reply('Successfully reported ' + StringUtil.boldify(args.member.user.tag) + '.');
    await msg.delete();
    return reply.delete(3000);
  }
}

module.exports = new Report();
