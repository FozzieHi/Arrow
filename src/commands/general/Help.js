const patron = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const Constants = require('../../utility/Constants.js');

class Help extends patron.Command {
  constructor() {
    super({
      names: ['help', 'commands', 'cmds', 'cmd'],
      groupName: 'general',
      description: 'View command information.',
      guildOnly: false,
      args: [
        new patron.Argument({
          name: 'command',
          key: 'command',
          type: 'string',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'balance',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args, sender) {
    if (StringUtil.isNullOrWhiteSpace(args.command)) {
      await sender.dm(msg.author, '**Arrow** is the slickest bot in town, all of the commands can be found at https://arrowdiscord.com/commands.\n\nYou can find a specific command\'s information by doing `?help [Command]`.\n\n**Arrow** is made by **Fozzie#8606**.');

      if (msg.channel.type !== 'dm') {
        return sender.reply('You have been DMed with all of the command information.');
      }
    } else {
      args.command = args.command.startsWith(Constants.prefix) ? args.command.slice(Constants.prefix.length) : args.command;

      const lowerInput = args.command.toLowerCase();

      const command = msg.client.registry.commands.find((x) => x.names.some((y) => y === lowerInput));

      if (command === undefined) {
        return sender.reply('This command does not exist.', { color: Constants.errorColor });
      }

      return sender.send('**Description:** ' + command.description + '\n**Usage:** `' + Constants.prefix + command.getUsage() + '`\n**Example:** `' + Constants.prefix + command.getExample() + '`', { title: StringUtil.upperFirstChar(command.names[0]) });
    }
  }
}

module.exports = new Help();
