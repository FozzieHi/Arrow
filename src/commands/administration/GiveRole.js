const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');

class GiveRole extends patron.Command {
  constructor() {
    super({
      names: ['giverole', 'role', 'giveuserrole', 'assignrole', 'rolegive', 'roleassign'],
      groupName: 'administration',
      description: 'Give a user a role.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'Fozzie#0001'
        }),
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Member',
          preconditions: ['hierarchyuser', 'hierarchy'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    const mutedRole = msg.dbGuild.roles.muted;
    if (args.role.id === mutedRole) {
      return sender.reply('You cannot manually assign the Muted role.', { color: Constants.errorColor });
    }
    await args.member.addRole(args.role);
    return sender.reply('Successfully given ' + StringUtil.boldify(args.member.user.tag) + ' the ' + args.role + ' role.');
  }
}

module.exports = new GiveRole();
