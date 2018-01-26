const db = require('../../database');
const patron = require('patron.js');
const USD = require('../../utility/USD.js');
const StringUtil = require('../../utility/StringUtil.js');

class Balance extends patron.Command {
  constructor() {
    super({
      names: ['cash', 'balance', 'money', 'bal', 'dollars'],
      groupName: 'general',
      description: 'View anyone\'s balance.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'Fozzie#0001',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    const dbUser = msg.author.id === args.member.id ? msg.dbUser : await db.userRepo.getUser(args.member.id, msg.guild.id);

    return sender.send(StringUtil.boldify(args.member.user.tag) + '\'s balance: ' + USD(dbUser.cash) + '.');
  }
}

module.exports = new Balance();
