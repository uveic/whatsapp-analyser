import {data, processFileContent} from './processor.js';
import {displayResult} from './htmlGenerator.js';

const fileContentOutput = document.querySelector('div#file-content-wrapper > div');
const statsOutput = document.querySelector('div#file-stats');
const filePicker = document.querySelector('input#file-input');

filePicker.addEventListener('change', e => {
  e.preventDefault();

  if (filePicker.files.length > 1) {
    alert('Too many files. Pick only one. Aborting...');
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => processFileContent(String(reader.result), fileContentOutput));
  reader.addEventListener('loadend', () => displayResult(data, statsOutput));
  reader.addEventListener('error', () => alert('Error processing file.'));
  reader.readAsText(filePicker.files[0]);
});

document.querySelector('label.input-label').addEventListener('click', (e) => {
  fileContentOutput.innerHTML = '';
  statsOutput.innerHTML = '';
});
