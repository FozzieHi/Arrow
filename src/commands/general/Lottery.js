const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Lottery extends patron.Command {
  constructor() {
    super({
      names: ['lottery', 'lotto'],
      groupName: 'botowners',
      description: 'Find out what the Lottery is.'
    });
  }

  async run(msg, args, sender) {
    if (msg.dbGuild.lottery === false) {
      return sender.reply('Sorry! the Lottery is currently disabled on this server, enable it with `?togglelottery`.', { color: Constants.errorColor });
    }
    return sender.reply('Every time you can make normal chatting money (Every 30 seconds, 7 characters long, you have a 1% chance of winning the Lottery, the winnings could be from $500 to $10,000 depending on your luck!');
  }
}

module.exports = new Lottery();
