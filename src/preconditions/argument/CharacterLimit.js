const patron = require('patron.js');

class CharacterLimit extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'characterlimit'
    });
  }

  async run(command, msg, argument, args, value, options) {
    if (value.length <= options.limit) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'The ' + argument.name + ' may not be longer than ' + options.limit + ' characters.');
  }
}

module.exports = new CharacterLimit();
