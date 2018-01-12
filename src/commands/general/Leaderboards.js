const db = require('../../database');
const Constants = require('../../utility/Constants.js');
const patron = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const USD = require('../../utility/USD.js');

class Leaderboards extends patron.Command {
  constructor() {
    super({
      names: ['leaderboards', 'lb', 'highscores', 'highscore', 'leaderboard', 'baltop'],
      groupName: 'general',
      description: 'View the wealthiest Citizens.'
    });
  }

  async run(msg, args, sender) {
    const users = await db.userRepo.findMany({ guildId: msg.guild.id });

    users.sort((a, b) => b.cash - a.cash);

    let message = '';

    for (let i = 0; i < users.length; i++) {
      if (i + 1 > Constants.leaderboardCap) {
        break;
      }

      const user = msg.client.users.get(users[i].userId);

      if (user === undefined) {
        continue;
      }

      message += (i + 1) + '. ' + StringUtil.boldify(user.tag) + ': ' + USD(users[i].cash) + '\n';
    }

    if (StringUtil.isNullOrWhiteSpace(message) === true) {
      return sender.reply('No leaderboard data found.', { color: Constants.errorColor });
    }

    return sender.send(message, { title: 'The Wealthiest Citizens' });
  }
}

module.exports = new Leaderboards();
