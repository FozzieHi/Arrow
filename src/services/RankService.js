class RankService {
  async handle(dbUser, dbGuild, member, users) {
    await member.guild.fetchMember(member.client.user);

    if (member.guild.me.hasPermission('MANAGE_ROLES') === false) {
      return;
    }

    const highsetRolePosition = member.guild.me.highestRole.position;
    const rolesToAdd = [];
    const rolesToRemove = [];

    for (const rank of dbGuild.roles.rank) {
      const role = member.guild.roles.get(rank.id);

      if (role !== undefined && role.position < highsetRolePosition) {
        if (member.roles.has(role.id) === false) {
          if (dbUser.cash >= rank.cashRequired) {
            rolesToAdd.push(role);
          }
        } else if (dbUser.cash < rank.cashRequired) {
          rolesToRemove.push(role);
        }
      }
    }

    if (rolesToAdd.length > 0) {
      return member.addRoles(rolesToAdd);
    } else if (rolesToRemove.length > 0) {
      return member.removeRoles(rolesToRemove);
    }
  }

  getRank(dbUser, dbGuild, guild) {
    const sortedRanks = dbGuild.roles.rank.sort((a, b) => a.cashRequired - b.cashRequired);

    for (let i = 0; i < sortedRanks.length; i++) {
      if (dbUser.cash >= sortedRanks[i].cashRequired) {
        var role = guild.roles.get(sortedRanks[i].id);
      }
    }

    return role;
  }
}

module.exports = new RankService();
