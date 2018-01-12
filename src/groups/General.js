const patron = require('patron.js');

class General extends patron.Group {
  constructor() {
    super({
      name: 'general'
    });
  }
}

module.exports = new General();
