const patron = require('patron.js');
const ModerationService = require('../../services/ModerationService.js');

class Administrator extends patron.Precondition {
  constructor() {
    super({
      name: 'administrator'
    });
  }

  async run(command, msg) {
    if (ModerationService.getPermLevel(msg.dbGuild, msg.guild.member(msg.author)) >= 2) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'You must be an administrator in order to use this command.');
  }
}

module.exports = new Administrator();
