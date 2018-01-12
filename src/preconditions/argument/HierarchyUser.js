const patron = require('patron.js');

class HierarchyUser extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'hierarchyuser'
    });
  }
  async run(command, msg, argument, args, value) {
    if (value.position < msg.guild.member(msg.author).highestRole.position) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'You are not higher in role hierarchy than ' + value + '.');
  }
}

module.exports = new HierarchyUser();
