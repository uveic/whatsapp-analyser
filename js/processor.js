import { util } from './util.js';

const data = {
    totalMessages: 0,
    users: [],
    groupMessages: []
};

const processLine = function (line, fileContentOutput) {
    const newMessage = line.match(util.getNewLineRegexPattern());
    const postedOn = line.match(util.dateFormatRegexPattern);
    if (!newMessage) {
        if (postedOn) {
            data.groupMessages.push(line);
            return;
        }

        const allP = document.querySelectorAll('div#file-content-wrapper > div > p');
        const lastP = allP[allP.length - 1];
        lastP.innerHTML += '<br>' + line;

        return;
    }

    const userStartPosition = line.search(' - ');
    const userEndPosition = line.search(': ');

    data.totalMessages++;

    const user = line.substring(userStartPosition + 3, userEndPosition);
    if (!data.users[user]) {
        data.users[user] = {
            totalMessages: 0,
            firstMessageDate: null,
            lastMessageDate: null
        };
    }

    const postedOnDate = util.getDateFromWhatsAppFormat(postedOn[0]);
    data.users[user].totalMessages++;
    if (!data.users[user].firstMessageDate || data.users[user].firstMessageDate > postedOnDate) {
        data.users[user].firstMessageDate = postedOnDate;
    }

    if (!data.users[user].lastMessageDate || data.users[user].lastMessageDate < postedOnDate) {
        data.users[user].lastMessageDate = postedOnDate;
    }

    const output = '<p>' + line + '</p>';
    fileContentOutput.insertAdjacentHTML('beforeend', output);
};

const processFileContent = function (fileContent, fileContentOutput) {
    const lines = fileContent.split('\n');

    fileContentOutput.innerHTML = '';
    lines.forEach(l => processLine(l, fileContentOutput));
};

export {processFileContent, data};