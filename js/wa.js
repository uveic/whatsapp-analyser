var fs = require('fs');
var lineReader = require('readline');
var moment = require('moment');

var whatsAppTxtSourceFile = process.argv[2] || null;

if (!whatsAppTxtSourceFile) {
  console.log('Source file argument missed');
  process.exit(1);
}

var user = [];
var word = [];
var jaja = [];
var conversation = [];
var prevPostedOn = null;
var emoji = [];

var dayOfWeek = [];
var hourOfDay = [];

var media = 0;
var totalMessages = 0;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var arrayObjectIndexOf = function (myArray, searchTerm, property) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
}

var sortByCount = function (a, b) {
  if (a.count > b.count) return -1;
  if (a.count < b.count) return 1;
  return 0;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var lr = lineReader.createInterface({
  input: fs.createReadStream(whatsAppTxtSourceFile)
});

lr.on('line', (input) => processLine(input));
lr.on('close', () => displayOutput());

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var processLine = function(input) {
    var userStartPosition = input.search(' - ');
    var userEndPosition = input.search(': ');

    var postedOn = input.match(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2} - /g);

    if (postedOn && userStartPosition > 0 && userEndPosition > 0) {
      totalMessages++;

      var postedOn = moment(input.substring(0, 17), 'DD-MM-YYYY, HH:mm');
      var userName = input.substring(userStartPosition + 3, userEndPosition);
      var message = input.substring(userEndPosition + 2, input.length);

      var userIndex = arrayObjectIndexOf(user, userName, 'name');
      if (userIndex < 0) {
        user.push({
          'name': userName,
          'count': 1,
          'firstMessage': postedOn.format('DD-MM-YYYY')
        });
      } else {
        user[userIndex].count += 1;
      }

      if (prevPostedOn) {
        var duration = moment.duration(prevPostedOn.diff(postedOn));
        var hours = Math.abs(duration.asHours());
        if (hours > 5) {
          var conversationIndex = arrayObjectIndexOf(conversation, userName, 'name');
          if (conversationIndex < 0) {
            conversation.push({
              'name': userName,
              'count': 1
            });
          } else {
            conversation[conversationIndex].count += 1;
          }
        }
      }

      //////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////
      //// Number of messages by hour of day (00...23)

      var hod = postedOn.format('HH');
      var hodIndex = arrayObjectIndexOf(hourOfDay, hod, 'name');
      if (hodIndex < 0) {
        hourOfDay.push({
          'name': hod,
          'count': 1
        });
      } else {
        hourOfDay[hodIndex].count += 1;
      }

      //////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////
      //// Number of messages by day of week (Monday...Sunday)

      var dow = postedOn.format('dddd');
      var dowIndex = arrayObjectIndexOf(dayOfWeek, dow, 'name');
      if (dowIndex < 0) {
        dayOfWeek.push({
          'name': dow,
          'count': 1
        });
      } else {
        dayOfWeek[dowIndex].count += 1;
      }

      //////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////

      prevPostedOn = postedOn;
    } else {
      var message = input;
    }

    if (message.search('Media omitted') > 0) {
      media++;
      return;
    }

    var chunks = message.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
    chunks.forEach(subMessage => {
      if (subMessage.search(/[\uD800-\uDBFF]/) >= 0) {
        var emojiIndex = arrayObjectIndexOf(emoji, subMessage, 'name');
        if (emojiIndex < 0) {
          emoji.push({
            'name': subMessage,
            'count': 1
          });
        } else {
          emoji[emojiIndex].count += 1;
        }
      }
    });

    let lineWords = message.trim().split(' ');
    lineWords.forEach(w => {
      if (w.trim()) {
        w = w.toLowerCase();
        w = w.replace(/[^0-9a-zA-Z_áéíóúñ]/g, ''); // Remove not alphanumeric characters

        var wordIndex = arrayObjectIndexOf(word, w, 'name');
        if (wordIndex < 0) {
          word.push({
            'name': w,
            'count': 1
          });
        } else {
          word[wordIndex].count += 1;
        }

        if (w.length >= 2 && w.match(/[^ja]/g) === null) {
          var jajaIndex = arrayObjectIndexOf(jaja, w, 'name');
          if (jajaIndex < 0) {
            jaja.push({
              'name': w,
              'count': 1
            });
          } else {
            jaja[jajaIndex].count += 1;
          }
        }
      }
    });
};

var displayOutput = function() {
  console.log('Results:');
  console.log('====================================');
  console.log('Total messages: ' + totalMessages);
  console.log('Media shared: ' + media);
  console.log('====================================');
  console.log('Total messages: ');
  console.log('====================================');
  user.sort(sortByCount);
  user.forEach(u => {
    console.log(u.name + ': ' + u.count + ' ' + (u.count * 100 / totalMessages).toFixed(1) + '% - first message: ' + u.firstMessage);
  });

  console.log('====================================');
  console.log('Words count: ');
  console.log('====================================');
  word.sort(sortByCount);
  word.forEach(w => {
    if (w.count > 100) console.log(w.name + ': ' + w.count);
  });

  console.log('====================================');
  console.log('Emojis: ');
  console.log('====================================');
  emoji.sort(sortByCount);
  emoji.forEach(e => {
    if (e.count > 5) console.log(e.name + ': ' + e.count);
  });

  console.log('====================================');
  console.log('Jaja: ');
  console.log('====================================');
  jaja.sort(sortByCount);
  jaja.forEach(j => {
    if (j.count > 5) console.log(j.name + ': ' + j.count);
  });

  console.log('====================================');
  console.log('Conversation starters: ');
  console.log('====================================');
  conversation.sort(sortByCount);
  conversation.forEach(c => {
    console.log(c.name + ': ' + c.count);
  });

  console.log('====================================');
  console.log('Number of messages by day of week: ');
  console.log('====================================');
  dayOfWeek.sort(sortByCount);
  dayOfWeek.forEach(d => {
    console.log(d.name + ': ' + d.count + ' ' + (d.count * 100 / totalMessages).toFixed(1) + '%');
  });

  console.log('====================================');
  console.log('Number of messages by hour: ');
  console.log('====================================');
  hourOfDay.sort(sortByCount);
  hourOfDay.forEach(h => {
    console.log(h.name + ':00 => ' + h.count + ' ' + (h.count * 100 / totalMessages).toFixed(1) + '%');
  });
};
