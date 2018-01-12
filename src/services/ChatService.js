const db = require('../database');
const Constants = require('../utility/Constants.js');

class ChatService {
  constructor() {
    this.messages = new Map();
  }

  async applyCash(msg) {
    const lastMessage = this.messages.get(msg.author.id);
    const isMessageCooldownOver = lastMessage === undefined || Date.now() - lastMessage > Constants.messageCooldown;
    const isLongEnough = msg.content.length >= Constants.minCharLength;

    if (isMessageCooldownOver && isLongEnough) {
      this.messages.set(msg.author.id, Date.now());

      return db.userRepo.modifyCash(msg.dbGuild, msg.member, Constants.cashPerMessage * 100);
    }
  }
}

module.exports = new ChatService();
