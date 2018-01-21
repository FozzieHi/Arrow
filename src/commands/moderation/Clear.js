const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

class Clear extends patron.Command {
  constructor() {
    super({
      names: ['clear', 'prune', 'clearchat', 'chatclear', 'purge'],
      groupName: 'moderation',
      description: 'Clear up to ' + Constants.clear.max + ' messages in any text channel.',
      cooldown: 1000,
      botPermissions: ['MANAGE_MESSAGES'],
      args: [
        new patron.Argument({
          name: 'messages to clear',
          key: 'quantity',
          type: 'float',
          example: '5'
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'Spamming.',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    if (args.quantity > Constants.clear.max) {
      return sender.reply('The maximum messages to clear is ' + Constants.clear.max, { color: Constants.errorColor });
    }
    if (args.quantity < Constants.clear.min) {
      return sender.reply('The minimum messages to clear is ' + Constants.clear.min, { color: Constants.errorColor });
    }
    const logChannel = msg.guild.channels.get(msg.dbGuild.channels.modLog);
    if (msg.channel.id === logChannel) {
      const reply = await sender.reply('You cannot clear messages in the Moderation Log channel.', { color: Constants.errorColor });
      reply.delete(5000);
    }
    const messages = await msg.channel.fetchMessages({ limit: args.quantity + 1 });

    await msg.channel.bulkDelete(messages);

    const reply = await sender.reply('Successfully cleared ' + args.quantity + (args.quantity === 1 ? ' message' : ' messages'));

    ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Clear', Constants.warnColor, args.reason, msg.author, null, 'Messages Cleared', args.quantity, 'Channel', msg.channel);

    return reply.delete(3000);
  }
}

module.exports = new Clear();
