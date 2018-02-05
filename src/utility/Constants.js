class Constants {
  constructor() {
    this.defaultColors = [
      0xff269a,
      0x00ff00,
      0x00e828,
      0x08f8ff,
      0xf226ff,
      0xff1C8e,
      0x68ff22,
      0xffbe11,
      0x2954ff,
      0x9624ed,
      0xa8ed00
    ];
    this.errorColor = 0xff0000;
    this.banColor = 0xEA0C00;
    this.kickColor = 0xE8511F;
    this.muteColor = 0xFF720E;
    this.unbanColor = 0x13FF19;
    this.unmuteColor = 0x6DED5E;
    this.warnColor = 0xFFB620;

    this.botInvite = 'https://discordapp.com/oauth2/authorize?client_id=356376399399092235&scope=bot&permissions=8';
    this.serverInvite = 'https://discord.gg/edm8d84';
    this.website = 'https://arrowdiscord.com/';

    this.disabledEvents = [
      'CHANNEL_PINS_UPDATE',
      'MESSAGE_REACTION_ADD',
      'MESSAGE_REACTION_REMOVE',
      'MESSAGE_REACTION_REMOVE_ALL',
      'VOICE_STATE_UPDATE',
      'TYPING_START',
      'VOICE_SERVER_UPDATE',
      'RELATIONSHIP_ADD',
      'RELATIONSHIP_REMOVE'
    ];

    this.game = '?help | arrowdiscord.com';
    this.prefix = '?';

    this.regexes = {
      markdown: /(\*|~|`|_)+/g,
      prefix: /^\?/
    };

    this.cashPerMessage = 50;
    this.leaderboardCap = 10;
    this.messageCooldown = 30000;
    this.minCharLength = 7;

    this.commandSimilarity = 0.66;

    this.gambling = {
      minBet: 5
    };

    this.transfer = {
      fee: 0.1,
      min: 5
    };

    this.clear = {
      min: 2,
      max: 200
    };
    this.daily = {
      cash: 2000
    };
    this.mute = {
      defaultLength: 24
    };
    this.intervals = {
      autoUnmute: 60000
    };
    this.XP = {
      min: 10,
      max: 35
    };
  }
}

module.exports = new Constants();
