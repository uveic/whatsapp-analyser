import {util} from './util.js';

const generateSummaryHtml = (data) => {
  let output = '<h2>' + data.totalMessages.toLocaleString() + ' messages</h2>';

  output += '<h3>Group Info Messages: ' + data.groupMessages.length.toLocaleString() + '</h3>';

  return output;
};

const generateListOfUsersHtml = (data) => {
  let output = '<h2>Participants:</h2><ul>';

  console.log(data.users);
  const users = data.users.sort(util.sortByTotalMessages);
  console.log(users);

  for (const key in users) {
    output += '<li>' + key + ':</li>';
    output += '<ul>';
    output += '<li>' + users[key].totalMessages.toLocaleString() + ' messages</li>';
    output += '<li>First message: ' + users[key].firstMessageDate.toLocaleString() + '</li>';
    output += '<li>Last message: ' + users[key].lastMessageDate.toLocaleString() + '</li>';
    output += '</ul>';
    output += '</li>';
  }

  output += '</ul>';

  return output;
};

const generateGroupInfoHtml = (data) => {
  let output = '<h3>Group Info Messages:</h3>';
  data.groupMessages.forEach(l => output += '<p>' + l + '</p>');
  return output;
};

const displayResult = function (data, statsOutput) {
  statsOutput.innerHTML = '';
  statsOutput.insertAdjacentHTML('beforeend', generateListOfUsersHtml(data));
  statsOutput.insertAdjacentHTML('beforeend', generateSummaryHtml(data));
  statsOutput.insertAdjacentHTML('beforeend', generateGroupInfoHtml(data));
};

export {displayResult};