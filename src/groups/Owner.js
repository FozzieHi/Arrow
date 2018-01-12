const patron = require('patron.js');

class Administration extends patron.Group {
  constructor() {
    super({
      name: 'owner',
      preconditions: ['owner']
    });
  }
}

module.exports = new Administration ();
