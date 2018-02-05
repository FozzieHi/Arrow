const db = require('../../database');
const Constants = require('../../utility/Constants.js');
const patron = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');

class LevelLeaderboard extends patron.Command {
  constructor() {
    super({
      names: ['levelleaderboards', 'llb', 'levelhighscores', 'levelhighscore', 'levelleaderboard', 'levelbaltop', 'levellb'],
      groupName: 'general',
      description: 'View the wealthiest Citizens.'
    });
  }

  async run(msg, args, sender) {
    const users = await db.userRepo.findMany({ guildId: msg.guild.id });

    users.sort((a, b) => b.level - a.level);

    let message = '';

    for (let i = 0; i < users.length; i++) {
      if (i + 1 > Constants.leaderboardCap) {
        break;
      }

      const user = msg.client.users.get(users[i].userId);

      if (user === undefined) {
        continue;
      }

      message += (i + 1) + '. ' + StringUtil.boldify(user.tag) + ': ' + users[i].level + '\n';
    }

    if (StringUtil.isNullOrWhiteSpace(message) === true) {
      return sender.reply('No Level leaderboard data found.', { color: Constants.errorColor });
    }

    return sender.send(message, { title: 'The Highest Leveling Citizens' });
  }
}

module.exports = new LevelLeaderboard();
