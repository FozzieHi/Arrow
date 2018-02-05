const db = require('../../database');
const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const RankService = require('../../services/RankService.js');

class Rank extends patron.Command {
  constructor() {
    super({
      names: ['rank', 'info', 'information'],
      groupName: 'general',
      description: 'View the information of anyone.',
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
    const sortedUsers = (await db.userRepo.findMany({ guildId: msg.guild.id })).sort((a, b) => b.cash - a.cash);
    const rank = RankService.getRank(dbUser, msg.dbGuild, msg.guild);

    return sender.send('**Balance:** ' + NumberUtil.format(dbUser.cash * 100) + '\n**Position:** #' + (sortedUsers.findIndex((v) => v.userId === dbUser.userId) + 1) + '\n**XP:** ' + (dbUser.xp === undefined ? '0' : dbUser.xp) + '\n**Level:** ' + (dbUser.level === undefined ? '0' : dbUser.level) + '\n' + (rank !== undefined ? '**Rank:** ' + rank + '\n' : ''), { title: args.member.user.tag + '\'s Information' });
  }
}

module.exports = new Rank();
