const db = require('../../database');
const patron = require('patron.js');

class ResetUser extends patron.Command {
  constructor() {
    super({
      names: ['resetuser'],
      groupName: 'owner',
      description: 'Reset any member\'s data.',
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
    await db.userRepo.deleteUser(args.member.id, msg.guild.id);

    return sender.reply('Successfully reset ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag + '\'s') + ' data.');
  }
}

module.exports = new ResetUser();
