const Embed = require('../structures/Embed.js');
const StringUtil = require('./StringUtil.js');
const NumberUtil = require('./NumberUtil.js');

class Sender {
  constructor(msg) {
    this.msg = msg;
  }

  dm(user, description, options) {
    return this.constructor.send(user, description, options);
  }

  dmFields(fieldsAndValues, options) {
    return this.constructor.sendFields(this.msg.author, fieldsAndValues, options);
  }

  reply(description, options) {
    return this.constructor.reply(this.msg, description, options);
  }

  send(description, options) {
    return this.constructor.send(this.msg.channel, description, options);
  }

  sendFields(fieldsAndValues, options) {
    return this.constructor.sendFields(this.msg.channel, fieldsAndValues, options);
  }

  static reply(msg, description, options) {
    return this.send(msg.channel, StringUtil.boldify(msg.author.tag) + ', ' + description, options);
  }

  static send(channel, description, options = {}) {
    const descriptionType = typeof description;

    if (descriptionType === 'object') {
      options = description;
    } else if (descriptionType === 'string') {
      options.description = description;
    } else {
      throw new Error('The description must be an object or string');
    }

    return channel.send({ embed: new Embed(options) });
  }

  static sendFields(channel, fieldsAndValues, options = {}) {
    if (NumberUtil.isEven(fieldsAndValues.length) === false) {
      throw new Error('The number of fields and values must be even.');
    }

    options.fields = [];

    for (let i = 0; i < fieldsAndValues.length - 1; i++) {
      if (NumberUtil.isEven(i) === true) {
        options.fields.push({ name: fieldsAndValues[i], value: fieldsAndValues[i + 1] });
      }
    }

    return this.send(channel, options);
  }
}

module.exports = Sender;
