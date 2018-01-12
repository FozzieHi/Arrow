const leven = require('leven');
const Constants = require('./Constants.js');

class Similarity {
  compare(a, b) {
    const distance = leven(a, b);
    const longest = a.length > b.length ? a : b;

    return 1 - (distance / longest.length);
  }

  command(registry, input) {
    for (let i = 0; i < registry.commands.length; i++) {
      for (let j = 0; j < registry.commands[i].names.length; j++) {
        if (this.compare(input, registry.commands[i].names[j]) >= Constants.commandSimilarity) {
          return registry.commands[i].names[j];
        }
      }
    }
  }
}

module.exports = new Similarity();
