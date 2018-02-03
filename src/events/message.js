const Logger = require('../utility/Logger.js');
const client = require('../singletons/client.js');
const db = require('../database');
const discord = require('discord.js');
const patron = require('patron.js');
const Try = require('../utility/Try.js');
const Sender = require('../utility/Sender.js');
const Constants = require('../utility/Constants.js');
const NumberUtil = require('../utility/NumberUtil.js');
const StringUtil = require('../utility/StringUtil.js');
const Similarity = require('../utility/Similarity.js');
const ChatService = require('../services/ChatService.js');
const handler = new patron.Handler(client.registry);

client.on('message', (msg) => {
  (async () => {
    if (msg.author.bot === true) {
      return;
    }

    const inGuild = msg.guild !== null;

    if (inGuild === true) {
      msg.member = msg.member !== null ? msg.member : await msg.guild.fetchMember(msg.author);
      msg.dbUser = await db.userRepo.getUser(msg.author.id, msg.guild.id);
      msg.dbGuild = await db.guildRepo.getGuild(msg.guild.id);
    }
    const sender = new Sender(msg);

    if (Constants.regexes.prefix.test(msg.content) === false) {
      return inGuild === true ? ChatService.applyCash(msg, sender) : null;
    }

    if (msg.author.id === 246822376459730954) {
      return sender.reply('You are currently blacklisted from Arrow.');
    }

    await Logger.log('Message Id: ' + msg.id + ' | User Id: ' + msg.author.id + (inGuild === true ? ' | Guild Id: ' + msg.guild.id : '') + ' | User: ' + msg.author.tag + (inGuild ? ' | Guild: ' + msg.guild.name : '') + ' | Content: ' + msg.content, 'DEBUG');

    const result = await handler.run(msg, Constants.prefix, sender);

    if (result.success === false) {
      let message;

      switch (result.commandError) {
        case patron.CommandError.CommandNotFound: {
          if (result.commandName !== undefined) {
            const similarCommand = Similarity.command(msg.client.registry, result.commandName);

            if (similarCommand !== undefined) {
              await Try(sender.reply('Did you mean `' + Constants.prefix + StringUtil.upperFirstChar(similarCommand) + '`?'));
            }
          }

          return;
        }
        case patron.CommandError.Cooldown: {
          const cooldown = NumberUtil.msToTime(result.remaining);

          return Try(sender.send('Hours: ' + cooldown.hours + '\nMinutes: ' + cooldown.minutes + '\nSeconds: ' + cooldown.seconds, { title: StringUtil.upperFirstChar(result.command.names[0]) + ' Cooldown', color: Constants.errorColor }));
        }
        case patron.CommandError.Exception:
          if (result.error instanceof discord.DiscordAPIError) {
            if (result.error.code === 0 || result.error.code === 404 || result.error.code === 50013) {
              message = 'I do not have permission to do that.';
            } else if (result.error.code === 50007) {
              message = 'I do not have permission to DM that user. Try allowing DMs from server members.';
            } else if (result.error.code >= 500 && result.error.code < 600) {
              message = 'Houston, we have a problem. Discord internal server errors coming in hot.';
            } else {
              message = result.errorReason;
            }
          } else {
            message = result.errorReason;
            await Logger.handleError(result.error);
          }
          break;
        case patron.CommandError.InvalidArgCount:
          message = 'You are incorrectly using this command.\n**Usage:** `' + Constants.prefix + result.command.getUsage() + '`\n**Example:** `' + Constants.prefix + result.command.getExample() + '`';
          break;
        default:
          message = result.errorReason;
          break;
      }

      await Logger.log('Unsuccessful command result: ' + msg.id + ' | Reason: ' + result.errorReason, 'DEBUG');

      return Try(sender.reply(message, { color: Constants.errorColor }));
    }

    return Logger.log('Successful command result: ' + msg.id, 'DEBUG');
  })()
    .catch((err) => Logger.handleError(err));
});
