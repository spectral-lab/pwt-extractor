import { decode } from 'fast-png';
import ndarray from 'ndarray';
import { cloneDeep } from 'lodash';

const formatAsPwt = (ab, res) => {
  const decoded = decode(ab);
  const amps = new Float32Array(decoded.data).map(x => x / 255.);
  const amp2d = ndarray(amps, [decoded.height, decoded.width])
  const restoredPartials = res.map((partialPositions, idx) => {
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
  const freqs = Array(decoded.height).fill(440);
  
  const initPitchArray = () => Array(decoded.width).fill(0);
  const initAmpArray = () => Array(decoded.width).fill(0);
  const pwt = {
    pitch: {},
    amp: {}
  }

  partialsToConvert.forEach((partial, idx )=> {
    const key = String(idx)
    pwt.pitch[key] = initPitchArray();
    pwt.amp[key] = initAmpArray();
    partial.points.forEach((point) => {
      const row = point[0]
      const column = point[1]
      pwt.amp[key][column] = amp2d.get(row, column);
      pwt.pitch[key][column] = freqs[row];
    })
  })

  return pwt;
}
export default formatAsPwt;