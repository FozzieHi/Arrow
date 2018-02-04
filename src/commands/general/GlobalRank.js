const db = require('../../database');
const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class GlobalRank extends patron.Command {
  constructor() {
    super({
      names: ['grank', 'ginfo', 'ginformation', 'globalrank', 'globalinfo', 'globalinformation'],
      groupName: 'general',
      description: 'View the Global information of anyone.',
      cooldown: 600000,
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
    const waitingMsg = await sender.reply('Gathering Global Rank data.');
    const dbUser = msg.author.id === args.member.id ? msg.dbUser : await db.userRepo.getUser(args.member.id);
    const sortedUsers = (await db.userRepo.findMany()).sort((a, b) => b.cash - a.cash);

    await sender.send('**Guild Balance:** ' + NumberUtil.format(dbUser.cash * 100) + '\n**Global Position:** #' + (sortedUsers.findIndex((v) => v.userId === dbUser.userId) + 1), { title: args.member.user.tag + '\'s Global Information' });
    return waitingMsg.delete();
  }
}

module.exports = new GlobalRank();
