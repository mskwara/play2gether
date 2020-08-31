function showFields(obj, space) {
    if (typeof obj !== 'object' || obj === null) {
        console.log(space + obj);
        return;
    }
    const props = Object.getOwnPropertyNames(obj);
    for (let prop in props) {
        console.log(space + props[prop] + ":");
        showFields(obj[props[prop]], "| " + space);
    }
}

module.exports = showFields;