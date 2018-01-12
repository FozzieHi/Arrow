const patron = require('patron.js');
const USD = require('../../utility/USD.js');

class MinimumCash extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'minimumcash'
    });
  }

  async run(command, msg, argument, args, value, options) {
    if (value >= options.minimum) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'The minimum ' + argument.name + ' is ' + USD(options.minimum) + '.');
  }
}

module.exports = new MinimumCash();
