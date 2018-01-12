const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class ModRoles extends patron.Command {
  constructor() {
    super({
      names: ['modroles', 'modrole', 'mr', 'mrs'],
      groupName: 'general',
      description: 'View all moderation roles in this guild.'
    });
  }

  async run(msg, args, sender) {
    const modRoleList = msg.dbGuild.roles.mod.sort((a, b) => a.permissionLevel - b.permissionLevel);

    if (msg.dbGuild.roles.mod.length === 0) {
      return sender.reply('No moderation role data found.', { color: Constants.errorColor });
    }

    let description = '';
    for (let i = 0; i < modRoleList.length; i++) {
      const rank = msg.guild.roles.find((x) => x.id === modRoleList[i].id);

      description += rank + ': ' + (modRoleList[i].permissionLevel) + '\n';
    }

    return sender.send(description + '\n**Permission Levels:**\n**1)** Moderator\n**2)** Administrator\n**3)** Owner', { title: 'Moderation Roles' });
  }
}

module.exports = new ModRoles();
