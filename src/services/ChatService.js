const db = require('../database');
const Constants = require('../utility/Constants.js');
const Random = require('../utility/Random.js');
const USD = require('../utility/USD.js');

class ChatService {
  constructor() {
    this.messages = new Map();
  }

  async applyCash(msg, sender) {
    const lastMessage = this.messages.get(msg.author.id);
    const isMessageCooldownOver = lastMessage === undefined || Date.now() - lastMessage > Constants.messageCooldown;
    const isLongEnough = msg.content.length >= Constants.minCharLength;

    if (isMessageCooldownOver && isLongEnough) {
      this.messages.set(msg.author.id, Date.now());
      if (Random.nextFloat(0, 100) <= 1) {
        const winnings = Random.nextInt(500, 10000) * 100;
        await sender.reply('Congratulations! You just won the Lottery and gained ' + USD(winnings));
        return db.userRepo.modifyCash(msg.dbGuild, msg.member, winnings);
      }
      return db.userRepo.modifyCash(msg.dbGuild, msg.member, Constants.cashPerMessage * 100);
    }
  }
}

module.exports = new ChatService();
