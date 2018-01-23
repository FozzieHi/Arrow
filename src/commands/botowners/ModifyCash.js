const db = require('../../database');
const patron = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');

class ModifyCash extends patron.Command {
  constructor() {
    super({
      names: ['modifycash', 'modcash', 'modifybal', 'modifybalance'],
      groupName: 'botowners',
      description: 'Modify someone\'s balance.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'Fozzie#8606'
        }),
        new patron.Argument({
          name: 'amount',
          key: 'amount',
          type: 'quantity',
          example: '500'
        })
      ]
    });
  }

  async run(msg, args, sender) {
    await db.userRepo.modifyCash(msg.dbGuild, args.member, args.amount * 100);
    return sender.reply('Successfully modifed ' + (args.member.id === msg.author.id ? 'your' : StringUtil.boldify(args.member.user.tag) + '\'s') + ' balance.');
  }
}

module.exports = new ModifyCash();
