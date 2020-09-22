module.exports = user => {
    user.passwordChangedAt = undefined;
    user.privateConversations = undefined;
    user.groupConversations = undefined;
    user.recentActivity = undefined;
    user.games = undefined;
    user.friendly = undefined;
    user.goodTeacher = undefined;
    user.skilledPlayer = undefined;
    user.praisedPlayers = undefined;
    return user;
}