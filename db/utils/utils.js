exports.formatDates = list => {
    return list.map(obj => ({...obj, created_at: new Date(obj.created_at)}));
};

exports.makeRefObj = (list, key, val) => {
    return list.reduce((acc, item) => ({ ...acc, [item[key]]: item[val] }), {})
};

exports.formatComments = (comments, articleRef) => {
    return comments.reduce((acc, obj, i) => {
        acc.push(Object.assign({}, obj));
        let ownerVal = acc[i].belongs_to;

        acc[i].article_id = articleRef[ownerVal];
        acc[i].created_at = new Date(acc[i].created_at);
        acc[i].author = acc[i].created_by;

        delete acc[i].belongs_to;
        delete acc[i].created_by;

        return acc;
    }, []);
};
