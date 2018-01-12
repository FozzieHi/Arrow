const db = require('../../database');
const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class RemoveModRole extends patron.Command {
  constructor() {
    super({
      names: ['removemodrole', 'removemod', 'rmr'],
      groupName: 'owner',
      description: 'Remove a mod role.',
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Moderator',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    if (msg.dbGuild.roles.mod.some((role) => role.id === args.role.id) === false) {
      return sender.reply('Moderation role has not been set.', { color: Constants.errorColor });
    }

    await db.guildRepo.upsertGuild(msg.guild.id, new db.updates.Pull('roles.mod', { id: args.role.id }));

    return sender.reply('Successfully removed the moderation role ' + args.role + '.');
  }
}

module.exports = new RemoveModRole();
