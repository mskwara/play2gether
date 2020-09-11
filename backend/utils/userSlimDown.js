module.exports = user => {
    user.passwordChangedAt = undefined;
    user.privateConversations = undefined;
    user.groupConversations = undefined;
    user.recentActivity = undefined;
    return user;
}