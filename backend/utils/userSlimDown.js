module.exports = user => {
    user.passwordChangedAt = undefined;
    user.privateConversations = undefined;
    user.groupConversations = undefined;
    return user;
}