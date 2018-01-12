const patron = require('patron.js');

class Moderation extends patron.Group {
  constructor() {
    super({
      name: 'moderation',
      preconditions: ['moderator']
    });
  }
}

module.exports = new Moderation ();
