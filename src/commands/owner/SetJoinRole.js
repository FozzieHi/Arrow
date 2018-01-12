const patron = require('patron.js');
const db = require('../../database');

class SetJoinRole extends patron.Command {
  constructor() {
    super({
      names: ['setjoinrole', 'setjoin', 'sjr', 'joinset', 'joinrole', 'joinroleset'],
      groupName: 'owner',
      description: 'Sets the join role.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Member',
          preconditions: ['hierarchy'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    await db.guildRepo.upsertGuild(msg.guild.id, { $set: { 'roles.join': args.role.id } });
    return sender.reply('Successfully set the join role to ' + args.role + '.');
  }
}

module.exports = new SetJoinRole();
