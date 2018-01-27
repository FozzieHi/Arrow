class Guild {
  constructor(guildId) {
    this.guildId = guildId;
    this.caseNumber = 1;
    this.reportNumber = 1;
    this.editLogs = true;
    this.deleteLogs = true;
    this.joinLogs = true;
    this.blackListed = false;
    this.roles = {
      mod: [],
      rank: [],
      muted: null,
      join: null
    };
    this.channels = {
      gambling: null,
      modLog: null,
      welcome: null,
      reports: null,
      announcements: null
    };
  }
}

module.exports = Guild;
