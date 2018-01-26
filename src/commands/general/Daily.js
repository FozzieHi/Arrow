const db = require('../../database');
const patron = require('patron.js');
const USD = require('../../utility/USD.js');
const StringUtil = require('../../utility/StringUtil.js');
const Constants = require('../../utility/Constants.js');

class Daily extends patron.Command {
  constructor() {
    super({
      names: ['daily', 'collect', 'dailycash', 'dailycollect'],
      groupName: 'general',
      description: 'Collect or gift your daily ' + USD(Constants.daily.cash * 100) + '.',
      cooldown: 86400000,
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
    if (args.member.id === msg.author.id || StringUtil.isNullOrWhiteSpace(args.member.id) || args.member.id === undefined) {
      await sender.reply('You collected your daily ' + USD(Constants.daily.cash * 100) + ', come back tomorrow for more.');
      return db.userRepo.modifyCash(msg.dbGuild, msg.author, Constants.daily.cash * 100);
    }
    await sender.reply('You gifted your daily ' + USD(Constants.daily.cash * 100) + ' to ' + StringUtil.boldify(args.member.user.tag) + '.');
    return db.userRepo.modifyCash(msg.dbGuild, args.member, Constants.daily.cash * 100);
  }
}

module.exports = new Daily();
