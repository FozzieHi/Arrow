const db = require('../../database');
const Constants = require('../../utility/Constants.js');
const patron = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const USD = require('../../utility/USD.js');

class GlobalLeaderboard extends patron.Command {
  constructor() {
    super({
      names: ['gleaderboards', 'glb', 'ghighscores', 'ghighscore', 'gleaderboard', 'gbaltop', 'globallb', 'globalleaderboard', 'globalhighscore'],
      groupName: 'general',
      description: 'View the wealthiest Citizens globally.',
      cooldown: 600000
    });
  }

  async run(msg, args, sender) {
    const waitingMsg = await sender.reply('Gathering Global Leaderboard data.');
    const users = await db.userRepo.findMany();

    users.sort((a, b) => b.cash - a.cash);

    let message = '';

    for (let i = 0; i < users.length; i++) {
      if (i + 1 > Constants.leaderboardCap + 1) {
        break;
      }

      const user = msg.client.users.get(users[i].userId);

      if (user === undefined) {
        continue;
      }

      message += (i) + '. ' + StringUtil.boldify(user.tag) + ': ' + USD(users[i].cash) + '\n';
    }

    if (StringUtil.isNullOrWhiteSpace(message) === true) {
      return sender.reply('No Global leaderboard data found.', { color: Constants.errorColor });
    }

    await sender.send(message, { title: 'The Wealthiest Citizens Globally' });
    return waitingMsg.delete();
  }
}

module.exports = new GlobalLeaderboard();
