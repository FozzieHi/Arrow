const BaseRepository = require('./BaseRepository.js');
const MuteQuery = require('../queries/MuteQuery.js');
const Mute = require('../models/Mute.js');
const db = require('../../database');

class MuteRepository extends BaseRepository {
  anyMute(userId, guildId) {
    return this.any(new MuteQuery(userId, guildId));
  }

  insertMute(userId, guildId) {
    return this.insertOne(new Mute(userId, guildId));
  }

  findMute(userId, guildId) {
    return this.find(new MuteQuery(userId, guildId));
  }

  deleteMute(userId, guildId) {
    return this.deleteOne(new MuteQuery(userId, guildId));
  }
  getMutes() {
    return db.muteRepo.findMany();
  }
}

module.exports = MuteRepository;
