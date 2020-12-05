const userPattern = / - [^\n\r<]+: /g;
const dateFormatRegexPattern = /\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/g;

const getNewLineRegexPattern = () => {
    return new RegExp(
        dateFormatRegexPattern.source + userPattern.source,
        'g'
    );
};

const getDateFromWhatsAppFormat = (dateString) => {
    const year = dateString.substring(6, 10);
    const month = dateString.substring(3, 5);
    const day = dateString.substring(0, 2);
    const hour = dateString.substring(12, 14);
    const minute = dateString.substring(15, 17);

    return new Date(year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':00Z');
}

const sortByTotalMessages = (a, b) => {
    if (a.totalMessages > b.totalMessages) {
        return -1;
    }

    if (a.totalMessages < b.totalMessages) {
        return 1;
    }

    return 0;
}

export const util = {
    sortByTotalMessages,
    getNewLineRegexPattern,
    getDateFromWhatsAppFormat,
    dateFormatRegexPattern
};