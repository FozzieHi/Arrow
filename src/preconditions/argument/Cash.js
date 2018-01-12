const patron = require('patron.js');
const USD = require('../../utility/USD.js');

class Cash extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'cash'
    });
  }

  async run(command, msg, argument, args, value) {
    if (msg.dbUser.cash >= value) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'You do not have ' + USD(value) +'. Balance: ' + USD(msg.dbUser.cash) + '.');
  }
}

module.exports = new Cash();
