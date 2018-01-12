const patron = require('patron.js');

class Administration extends patron.Group {
  constructor() {
    super({
      name: 'administration',
      preconditions: ['administrator']
    });
  }
}

module.exports = new Administration ();
