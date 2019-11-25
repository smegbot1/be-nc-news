exports.formatDates = list => {
    return list.map(obj => ({...obj, created_at: new Date(obj.created_at)}));
};

exports.makeRefObj = (list, key, val) => {
    return list.reduce((acc, item) => ({ ...acc, [item[key]]: item[val] }), {})
};

exports.formatComments = (comments, articleRef) => {
    return [];
};
