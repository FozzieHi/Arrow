const patron = require('patron.js');
const credentials = require('../../credentials.json');

class BotOwner extends patron.Precondition {
  constructor() {
    super({
      name: 'botowner'
    });
  }

  async run(command, msg) {
    if (credentials.ownerIds.some((v) => v === msg.author.id)) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'You must be a bot owner in order to use this command.');
  }
}

module.exports = new BotOwner();
