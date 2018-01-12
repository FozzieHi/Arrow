const patron = require('patron.js');

class Gambling extends patron.Group {
  constructor() {
    super({
      name: 'gambling',
      description: 'These commands are used for gambling your money.'
    });
  }
}

module.exports = new Gambling();
