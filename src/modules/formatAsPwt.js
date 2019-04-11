import { cloneDeep } from 'lodash';
import { ftom } from './utils';

/**
 * @param {Object} resultOfSTFT 
 * @param {Array.<Array.<Array.<Number>>>} arrayOfPartialPositions partialPositions is array of [x, y] pair 
 */
const formatAsPwt = (resultOfSTFT, arrayOfPartialPositions) => {
  const magnitude2d = resultOfSTFT.magnitude2d;
  const notes = resultOfSTFT.freqs.map(freq => ftom(freq));
  const restoredPartials = arrayOfPartialPositions.map((partialPositions, idx) => {
    return {
      id: idx,
      startTimeIdx: partialPositions[0][1],
      endTimeIdx: partialPositions[partialPositions.length-1][1],
      points: partialPositions,
      numberOfPoints: partialPositions.length
    };
  });
  const partials = cloneDeep(restoredPartials);
  partials.sort((a, b) => a.startTimeIdx - b.startTimeIdx);

  // fill blank time
  for (let i = 0; i < partials.length - 1; i = i + 1) {
    for (let j = i + 1; j < partials.length; ) {
      if (partials[i].endTimeIdx < partials[j].startTimeIdx) {
        partials[i].endTimeIdx = partials[j].endTimeIdx;
        partials[i].points.push(...partials[j].points);
        partials[i].numberOfPoints += partials[j].numberOfPoints;
        partials.splice(j, 1);
      } else {
        j = j + 1;
      }
    }
  }
  
  const partialsToConvert = partials.filter((_, idx) => idx < 15);
  
  const initPitchArray = () => Array(magnitude2d[0].length).fill(0);
  const initAmpArray = () => Array(magnitude2d[0].length).fill(0);
  const pwt = {
    pitch: {},
    amp: {}
  };

  partialsToConvert.forEach((partial, idx) => {
    const key = String(idx)
    pwt.pitch[key] = initPitchArray();
    pwt.amp[key] = initAmpArray();
    partial.points.forEach((point) => {
      const row = point[0]
      const column = point[1]
      pwt.amp[key][column] = magnitude2d[row][column];
      pwt.pitch[key][column] = notes[row];
    })
  });

  return pwt;
}
export default formatAsPwt;