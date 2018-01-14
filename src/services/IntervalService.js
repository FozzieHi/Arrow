const path = require('path');
const requireAll = require('require-all');

class IntervalService {
  initiate(client) {
    const obj = requireAll(path.join(__dirname, '../intervals'));

    for (const key in obj) {
      if (obj.hasOwnProperty(key) === true) {
        obj[key](client);
      }
    }
  }
}

module.exports = new IntervalService();
