exports.formatDate = (date, type) => {
    const localDate = new Date(date).toLocaleString();
    let result;
    switch (type) {
        case "short":
            result = localDate.substr(12, 5);
            break;
    }
    return result;
};

exports.getActiveDotColor = (group, conv, activeUserId, user = null) => {
    if (user !== null) {
        const now = new Date();
        const hisRecentActivity = new Date(user.recentActivity);
        const timeInSeconds =
            (now.getTime() - hisRecentActivity.getTime()) / 1000;
        let color = "red";
        if (timeInSeconds <= 60 * 5) {
            color = "green";
        } else if (timeInSeconds <= 60 * 15) {
            color = "yellow";
        }

        return color;
    }
    if (!group) {
        const now = new Date();
        let hisRecentActivity;

        if (conv.user._id === activeUserId) {
            //correspondent to ten drugi
            hisRecentActivity = new Date(conv.correspondent.recentActivity);
        } else {
            //user to ten drugi
            hisRecentActivity = new Date(conv.user.recentActivity);
        }
        const timeInSeconds =
            (now.getTime() - hisRecentActivity.getTime()) / 1000;
        let color = "red";
        if (timeInSeconds <= 60 * 5) {
            color = "green";
        } else if (timeInSeconds <= 60 * 15) {
            color = "yellow";
        }

        return color;
        // setChatStateAndRef({ recentActivityColor: color });
        // console.log(props.conv);
    } else {
        // console.log(props.conv);
        const now = new Date();
        let min = 60 * 100;
        for (let i = 0; i < conv.participants.length; i++) {
            if (conv.participants[i]._id !== activeUserId) {
                const currentRecentActivity = new Date(
                    conv.participants[i].recentActivity
                );
                const timeInSeconds =
                    (now.getTime() - currentRecentActivity.getTime()) / 1000;
                if (timeInSeconds < min) {
                    min = timeInSeconds;
                }
            }
        }

        let color = "red";
        if (min <= 60 * 5) {
            color = "green";
        } else if (min <= 60 * 15) {
            color = "yellow";
        }

        return color;
        // setChatStateAndRef({ recentActivityColor: color });
    }
};
