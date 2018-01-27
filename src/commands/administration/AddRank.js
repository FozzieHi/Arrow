const db = require('../../database');
const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const USD = require('../../utility/USD.js');

class AddRank extends patron.Command {
  constructor() {
    super({
      names: ['addrank', 'newrank'],
      groupName: 'administration',
      description: 'Add a rank role.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Wealthy',
          preconditions: ['hierarchy']
        }),
        new patron.Argument({
          name: 'cashNeeded',
          key: 'cashRequired',
          type: 'quantity',
          example: '500'
        })
      ]
    });
  }

  async run(msg, args, sender) {
    const cashRequired = args.cashRequired * 100;
    if (msg.dbGuild.roles.rank.some((role) => role.id === args.role.id) === true) {
      return sender.reply('Rank role has already been set.', { color: Constants.errorColor });
    }

    await db.guildRepo.upsertGuild(msg.guild.id, new db.updates.Push('roles.rank', { id: args.role.id, cashRequired: Math.round(cashRequired) }));

    return sender.reply('Successfully added the rank role ' + args.role + ' with a balance required amount of ' + USD(cashRequired) + '.');
  }
}

module.exports = new AddRank();
