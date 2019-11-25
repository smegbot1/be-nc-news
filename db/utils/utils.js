exports.formatDates = list => {
    return list.map(obj => ({...obj, created_at: new Date(obj.created_at)}));
};

exports.makeRefObj = (list, key, val) => {
    return list.reduce((acc, item) => ({ ...acc, [item[key]]: item[val] }), {})
};

exports.formatComments = (comments, articleRef, key, newKey) => {
    const result = [];
    comments.forEach((obj, i) => {
        result.push(Object.assign({}, obj))
        let ownerVal = result[i][key]

        result[i][newKey] = articleRef[ownerVal];
        delete result[i][key];
        result[i].created_at = new Date(result[i].created_at);
        result[i].author = result[i].created_by;
        delete result[i].created_by;
    });
    return result;
};
