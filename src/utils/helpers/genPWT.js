import { ftom } from '.'
import { PeakLine } from '../../classes'  // eslint-disable-line no-unused-vars

/**
 * @param {Object} resultOfSTFT
 * @param {Array.<PeakLine>} lines - Array of lines to be formatted as PWT
 * @return {{duration: number, pitch: Object, magnitude: Object}}
 */
const genPWT = (resultOfSTFT, lines) => {
  const pwt = initPWT(resultOfSTFT, lines);
  const notes = resultOfSTFT.freqs.map(freq => ftom(freq));
  lines.forEach((line, idx) => {
    line.points.forEach((point) => {
      const row = point[0];
      const column = point[1];
      pwt.magnitude[idx][column] = resultOfSTFT.magnitude2d[row][column];
      pwt.pitch[idx][column] = notes[row];
    })
  });
  return pwt;
} 

/**
 * @param {Object} resultOfSTFT
 * @param {Array.<PeakLine>} lines - Array of lines to be formatted as PWT
 * @return {{duration: number, pitch: Object, magnitude: Object}} initialized PWT with all values 0
 */
const initPWT = (resultOfSTFT, lines) => {
  const times = resultOfSTFT.times;
  const duration = times[times.length - 1] * 1000; // in millisecond
  const numberOfVoices = lines.length
  const initialPWT = {
    duration,
    numberOfVoices,
    pitch: {},
    magnitude: {}
  }
  const MAX_VOICES = 15;  //Our synth can play up to 15 voices
  const numberOfColumns = resultOfSTFT.magnitude2d[0].length;
  // initialize voices
  for (let i = 0; i < MAX_VOICES; i++) {
    initialPWT.pitch[i] = Array(numberOfColumns).fill(0);
    initialPWT.magnitude[i] = Array(numberOfColumns).fill(0);
    }
  return initialPWT
}

export default genPWT;