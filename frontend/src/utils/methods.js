exports.formatDate = (date, type) => {
    const localDate = new Date(date).toLocaleString();
    let result;
    switch (type) {
        case "short":
            result = localDate.substring(11, 16);
            break;
    }
    return result;
};
