const db = require('../../database');
const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class AddModRole extends patron.Command {
  constructor() {
    super({
      names: ['addmodrole', 'addmod', 'setmod', 'amr'],
      groupName: 'owner',
      description: 'Add a moderation role.',
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Moderator'
        }),
        new patron.Argument({
          name: 'permissionLevel',
          key: 'permissionLevel',
          type: 'float',
          example: '1',
          default: 1
        })
      ]
    });
  }

  async run(msg, args, sender) {
    if (args.permissionLevel < 1 || args.permissionLevel > 3) {
      return sender.reply('**Permission levels:**\n**1)** Moderator\n**2)** Administrator\n**3)** Owner', { color: Constants.errorColor });
    } else if (msg.dbGuild.roles.mod.some((role) => role.id === args.role.id)) {
      return sender.reply('Moderation role has already been set.', { color: Constants.errorColor });
    }

    await db.guildRepo.upsertGuild(msg.guild.id, new db.updates.Push('roles.mod', { id: args.role.id, permissionLevel: args.permissionLevel }));

    return sender.reply('Successfully added the moderation role ' + args.role + ' with a level of ' + args.permissionLevel + '.');
  }
}

module.exports = new AddModRole();
