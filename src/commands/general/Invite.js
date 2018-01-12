const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Invite extends patron.Command {
  constructor() {
    super({
      names: ['invite', 'invitelink', 'support', 'invitelinks', 'links', 'link', 'website', 'site'],
      groupName: 'general',
      description: 'View the invite links.',
      guildOnly: false
    });
  }

  async run(msg, args, sender) {
    return sender.reply('The invite link to invite **Arrow** to your guild is: ' + Constants.botInvite + '\n\nThe **Arrow Support Guild**\'s invite link is ' + Constants.serverInvite + '\n\nThe **Official Arrow Website** link is ' + Constants.website);
  }
}

module.exports = new Invite();
