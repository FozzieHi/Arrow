const patron = require('patron.js');
const Sender = require('../../utility/Sender.js');
const StringUtil = require('../../utility/StringUtil.js');

class DM extends patron.Command {
  constructor() {
    super({
      names: ['dm', 'directmessage'],
      groupName: 'botowners',
      description: 'DM any user.',
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: 'Fozzie#8606'
        }),
        new patron.Argument({
          name: 'message',
          key: 'message',
          type: 'string',
          example: 'hi',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    await Sender.send(args.user, args.message);
    return sender.reply('Successfully DMed ' + StringUtil.boldify(args.user.tag) + '.');
  }
}

module.exports = new DM();
