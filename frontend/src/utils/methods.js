export function formatDate(date, type) {
    const localDate = new Date(date).toLocaleString();
    let result;
    switch (type) {
        case "short":
            result = localDate.substr(12, 5);
            break;
        default:
            result = localDate;
            break;
    }
    return result;
}

export function getActiveDotColor(group, conv, activeUserId, user = null) {
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
            // correspondent to ten drugi
            hisRecentActivity = new Date(conv.correspondent.recentActivity);
        } else {
            // user to ten drugi
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
}

export async function getPhotoFromAWS(key, func) {
    const encode = (data) => {
        const buf = Buffer.from(data);
        const base64 = buf.toString("base64");
        return base64;
    };

    const aws = require("aws-sdk");

    const REACT_APP_S3_BUCEKT = process.env.REACT_APP_S3_BUCKET;
    aws.config.region = "eu-central-1";
    const s3 = new aws.S3({
        apiVersion: "2006-03-01",
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });

    const params = {
        Bucket: REACT_APP_S3_BUCEKT,
        Key: key,
    };
    const data = await s3.getObject(params).promise();
    const encoded = encode(data.Body);
    const photo = `data:image/jpeg;base64,${encoded}`;
    func(photo);
    return photo;
}
