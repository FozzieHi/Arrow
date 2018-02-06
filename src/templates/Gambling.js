const patron = require('patron.js');
const db = require('../database');
const Random = require('../utility/Random.js');
const USD = require('../utility/USD.js');
const Constants = require('../utility/Constants.js');

class Gambling extends patron.Command {
  constructor(names, description, odds, payoutMultiplier, preconditions = []) {
    super({
      names: names,
      groupName: 'gambling',
      description: description,
      preconditions: preconditions,
      cooldown: 10000,
      args: [
        new patron.Argument({
          name: 'bet',
          key: 'bet',
          type: 'quantity',
          example: '500',
          preconditions: ['cash', { name: 'minimumcash', options: { minimum: Constants.gambling.minBet } }]
        })
      ]
    });

    this.odds = odds;
    this.payoutMultiplier = payoutMultiplier;
  }

  async run(msg, args, sender) {
    const roll = Random.roll();

    if (roll >= this.odds) {
      const winnings = args.bet * this.payoutMultiplier;

      const newDbUser = await db.userRepo.modifyCash(msg.dbGuild, msg.member, winnings * 100);

      return sender.reply('You rolled: ' + roll.toFixed(2) + '.\nCongratulations, you won ' + USD(winnings * 100) + '.\nBalance: ' + USD(newDbUser.cash) + '.');
    }

    const newDbUser = await db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.bet * 100);

    return sender.reply('You rolled: ' + roll.toFixed(2) + '.\nUnfortunately, you lost ' + USD(args.bet * 100) + '.\nBalance: ' + USD(newDbUser.cash) + '.');
  }
}

module.exports = Gambling;
