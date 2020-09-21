module.exports = user => {
    user.passwordChangedAt = undefined;
    user.privateConversations = undefined;
    user.groupConversations = undefined;
    user.recentActivity = undefined;
    user.games = undefined;
    return user;
}