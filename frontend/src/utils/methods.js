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
