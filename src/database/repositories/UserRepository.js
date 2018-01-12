const BaseRepository = require('./BaseRepository.js');
const UserQuery = require('../queries/UserQuery.js');
const User = require('../models/User.js');
const RankService = require ('../../services/RankService.js');

class UserRepository extends BaseRepository {
  anyUser(userId, guildId) {
    return this.any(new UserQuery(userId, guildId));
  }

  async getUser(userId, guildId) {
    const query = new UserQuery(userId, guildId);
    const fetchedUser = await this.findOne(query, guildId);

    return fetchedUser !== null ? fetchedUser : this.findOneAndReplace(query, new User(userId, guildId));
  }

  updateUser(userId, guildId, update) {
    return this.updateOne(new UserQuery(userId, guildId), update);
  }

  findUserAndUpdate(userId, guildId, update) {
    return this.findOneAndUpdate(new UserQuery(userId, guildId), update);
  }

  async upsertUser(userId, guildId, update) {
    if (await this.anyUser(userId, guildId)) {
      return this.updateUser(userId, guildId, update);
    }

    return this.updateOne(new User(userId, guildId), update, true);
  }

  async findUserAndUpsert(userId, guildId, update) {
    if (await this.anyUser(userId, guildId)) {
      return this.findUserAndUpdate(userId, guildId, update);
    }

    return this.findOneAndUpdate(new User(userId, guildId), update, true);
  }

  async modifyCash(dbGuild, member, change) {
    const newDbUser = await this.findUserAndUpsert(member.id, dbGuild.guildId, { $inc: { cash: change } });

    RankService.handle(newDbUser, dbGuild, member, await this.findMany({ guildId: dbGuild.guildId }));

    return newDbUser;
  }

  deleteUser(userId, guildId) {
    return this.deleteOne(new UserQuery(userId, guildId));
  }

  deleteUsers(guildId) {
    return this.deleteMany({ guildId: guildId });
  }
}

module.exports = UserRepository;
