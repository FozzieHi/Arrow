const patron = require('patron.js');
const credentials = require('../../credentials.json');
const Random = require('../../utility/Random.js');
const Nexmo = require('nexmo');
const Sender = require('../../utility/Sender.js');
const nexmo = new Nexmo({
  apiKey: credentials.nexmoApiKey,
  apiSecret: credentials.nexmoSecret
});

class BotOwner extends patron.Precondition {
  constructor() {
    super({
      name: 'botowner'
    });
  }

  async run(command, msg) {
    const sender = new Sender(msg);
    const ran = await Random.nextInt(100000, 999999).toString();
    if (credentials.ownerIds.some((v) => v === msg.author.id)) {
      await nexmo.message.sendSms(
        credentials.nexmoVirtualNumber, credentials.myNumber, 'Hey, George! Please verify yourself with this code: ' + ran,
        (err, responseData) => {
          if (err) {
            console.log(err);
          } else {
            console.dir(responseData);
          }
        }
      );
      await sender.reply('Please reply with your verification code.');
      const filter = (x) => x.content.toLowerCase() === ran && x.author.id === msg.author.id;
      const result = await msg.channel.awaitMessages(filter, { max: 1, time: 30000 });
      if (result.size === 1) {
        await sender.reply('Successfully authenticated.');
        return patron.PreconditionResult.fromSuccess();
      }
      return patron.PreconditionResult.fromError(command, 'Wrong verification code.');
    }

    return patron.PreconditionResult.fromError(command, 'You must be a bot owner in order to use this command.');
  }
}

module.exports = new BotOwner();
