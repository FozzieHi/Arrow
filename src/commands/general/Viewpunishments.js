const db = require('../../database');
const patron = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');

class Viewpunishments extends patron.Command {
  constructor() {
    super({
      names: ['viewpun', 'pun', 'punishments', 'punishment', 'viewpunishment', 'viewpunishments', 'checkpun'],
      groupName: 'general',
      description: 'View yours or a Users\' punishments.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'Robert#4826',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    const dbUser = msg.author.id === args.member.id ? msg.dbUser : await db.userRepo.getUser(args.member.id, msg.guild.id);

    return sender.send(StringUtil.boldify(args.member.user.tag) + '\'s punishments:\n\n**Warnings:** ' + (dbUser.warns === undefined ? '0' : dbUser.warns) + '\n**Mutes:** ' + (dbUser.mutes === undefined ? '0' : dbUser.mutes) + '\n**Kicks:** ' +
      (dbUser.kicks === undefined ? '0' : dbUser.kicks) + '\n**Bans:** ' + (dbUser.bans === undefined ? '0' : dbUser.bans) + '\n\n**Reports:** ' + (dbUser.reports === undefined ? '0' : dbUser.reports));
  }
}

module.exports = new Viewpunishments();
