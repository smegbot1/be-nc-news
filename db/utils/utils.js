exports.formatDates = list => {
    return list.map(obj => {
        obj.created_at = new Date(obj.created_at)
        return obj;
    });
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
