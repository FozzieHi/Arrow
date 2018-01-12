class User {
  constructor(userId, guildId) {
    this.userId = userId;
    this.guildId = guildId;
    this.cash = 0;
    this.warns = 0;
    this.kicks = 0;
    this.bans = 0;
  }
}

module.exports = User;
