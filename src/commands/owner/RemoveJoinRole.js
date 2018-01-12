const patron = require('patron.js');
const db = require('../../database');

class RemoveJoinRole extends patron.Command {
  constructor() {
    super({
      names: ['rjr', 'removejoinrole', 'joinroleremove', 'resetjoinrole'],
      groupName: 'owner',
      description: 'Removes the join role.'
    });
  }

  async run(msg, args, sender) {
    await db.guildRepo.upsertGuild(msg.guild.id, { $set: { 'roles.join': null } });
    return sender.reply('Successfully removed the join role.');
  }
}

module.exports = new RemoveJoinRole();
