import { ftom } from '.'
import { PeakLine } from '../../classes'  // eslint-disable-line no-unused-vars

/**
 * @param {Object} resultOfSTFT
 * @return {{duration: number, pitch: Object, magnitude: Object}} initialized PWT with all values 0
 */
const initPWT = (resultOfSTFT) => {
  const times = resultOfSTFT.times;
  const duration = times[times.length - 1] * 1000; // in millisecond
  const initialPWT = {
    duration,
    pitch: {},
    magnitude: {}
  }
  const NUMBER_OF_VOICES = 15;
  const numberOfColumns = resultOfSTFT.magnitude2d[0].length;
  // initialize voices
  for (let i = 0; i < NUMBER_OF_VOICES; i++) {
    initialPWT.pitch[i] = Array(numberOfColumns).fill(0);
    initialPWT.magnitude[i] = Array(numberOfColumns).fill(0);
    }
  return initialPWT
}

/**
 * @param {Object} resultOfSTFT
 * @param {Array.<PeakLine>} lines - Array of lines to be formatted as PWT
 * @return {{duration: number, pitch: Object, magnitude: Object}}
 */
const genPWT = (resultOfSTFT, lines) => {
  const pwt = initPWT(resultOfSTFT);
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

export default genPWT;