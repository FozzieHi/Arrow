const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class SendGuildMsg extends patron.Command {
  constructor() {
    super({
      names: ['sendmsgtoguild', 'sendguildmsg'],
      groupName: 'botowners',
      description: 'Send a guild a message.',
      guildOnly: false,
      args: [
        new patron.Argument({
          name: 'guild id',
          key: 'guildid',
          type: 'string',
          example: '356428177775788032'
        }),
        new patron.Argument({
          name: 'message',
          key: 'message',
          type: 'string',
          example: 'Announcement',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    const guildToSendMsg = msg.client.guilds.get(args.guildid);
    const mainChannel = guildToSendMsg.defaultChannel;
    if (mainChannel !== undefined) {
      mainChannel.send(args.message);
      return sender.reply('Successfully sent message to ' + guildToSendMsg.name + '.');
    }
    return sender.reply('Could not send message to the guild ' + guildToSendMsg.name + '.', { color: Constants.errorColor });
  }
}

module.exports = new SendGuildMsg();
