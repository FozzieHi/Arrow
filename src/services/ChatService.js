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
      await this.applyXP(msg);
      await this.checkLevel(msg, sender);
      this.messages.set(msg.author.id, Date.now());
      if (msg.dbGuild.lottery !== false) {
        if (Random.nextFloat(0, 100) <= 1) {
          const winnings = Random.nextInt(500, 10000) * 100;
          await sender.reply('Congratulations! You just won the Lottery and gained ' + USD(winnings));
          return db.userRepo.modifyCash(msg.dbGuild, msg.member, winnings);
        }
      }
      return db.userRepo.modifyCash(msg.dbGuild, msg.member, Constants.cashPerMessage * 100);
    }
  }

  async applyXP(msg) {
    const min = Constants.XP.min;
    const max = Constants.XP.max;

    const xp = await Random.nextInt(min, max);
    return db.userRepo.upsertUser(msg.author.id, msg.guild.id, { $inc: { xp: xp } });
  }

  async checkLevel(msg, sender) {
    const dbUser = await db.userRepo.getUser(msg.author.id, msg.guild.id);
    let xp = await dbUser.xp;
    let level = await dbUser.level;
    if (xp === undefined) {
      xp = 0;
    }
    if (level === undefined) {
      level = 1;
    }
    const xpInc = 50;
    const maxLevels = 500;
    for (let i = 1; i <= maxLevels; i++) {
      const maxXPForLevel = (xpInc * i) * i;
      if (xp === maxXPForLevel || (xp >= maxXPForLevel && level === i)) {
        await db.userRepo.upsertUser(msg.author.id, msg.guild.id, { $inc: { level: 1 } });
        return sender.reply('You have leveled up to Level ' + (parseInt(level) + 1));
      }
    }
  }
}

module.exports = new ChatService();
