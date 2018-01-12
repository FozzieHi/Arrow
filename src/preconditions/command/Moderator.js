const patron = require('patron.js');
const ModerationService = require('../../services/ModerationService.js');

class Administrator extends patron.Precondition {
  constructor() {
    super({
      name: 'moderator'
    });
  }

  async run(command, msg) {
    if (ModerationService.getPermLevel(msg.dbGuild, msg.guild.member(msg.author)) >= 1) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'You must be an moderator in order to use this command.');
  }
}

module.exports = new Administrator();
