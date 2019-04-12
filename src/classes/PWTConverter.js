import { ftom } from '../utils/helpers'
import { Line } from '.'  // eslint-disable-line no-unused-vars

/** Class representing a PWT which is then to be sent to Ableton. */
class PWTConverter {
  /**
   * @param {Object} resultOfSTFT - Points to be the line. Each point is a pair of [row, column]
   */
  constructor(resultOfSTFT){   
    this.resultOfSTFT = resultOfSTFT;
    this.pitch = {};
    this.magnitude = {};
    const NUMBER_OF_VOICES = 15;
    const numberOfColumns = this.resultOfSTFT.magnitude2d[0].length;
    // initialize voices
    for (let i = 0; i < NUMBER_OF_VOICES; i++) {
      this.pitch[i] = Array(numberOfColumns).fill(0);
      this.magnitude[i] = Array(numberOfColumns).fill(0);
    }
  }
  /**
   * @param {Array.<Line>} lines - Array of lines to be formatted as PWT
   */
  gen(lines) {
    const notes = this.resultOfSTFT.freqs.map(freq => ftom(freq));
    lines.forEach((line, idx) => {
      line.points.forEach((point) => {
        const row = point[0];
        const column = point[1];
        this.magnitude[idx][column] = this.resultOfSTFT.magnitude2d[row][column];
        this.pitch[idx][column] = notes[row];
      })
    });
    const times = this.resultOfSTFT.times;
    const durationInMillisecond = times[times.length - 1] * 1000;
    return {
      duration: durationInMillisecond,
      magnitude: this.magnitude,
      pitch: this.pitch
    }
  }
}

export default PWTConverter;