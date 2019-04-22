import {formatAsPwt, makePNGBuffer} from '../utils/helpers';
import { RECEIVED_PWT, RENDER_PEAK_LINES } from '../constants/events';
import { PeakLine } from '../classes';

const postImage = (spectrogram, eventHub) => {
  return new Promise((resolve, reject) => {
    const buff = makePNGBuffer(spectrogram.magnitude2d);
    fetch(process.env.VUE_APP_SERVER, {
      method: 'POST',
      body: buff,
      mode: 'cors'
    })
    .then(d => d.json())
    .then(_featureLines => {
      /**
       * All points detected as peak. Array is splited into chunks. Each chunk corresponds to each line.
       * @type {Array.<Array.<Array.<Number>>>} 
       */
      const featureLines = _featureLines;
      const peakLines = featureLines.map((pointsInOneLine, idx) => {
        return new PeakLine(pointsInOneLine, spectrogram, idx);
      });
      eventHub.$emit(RENDER_PEAK_LINES, peakLines);
      return formatAsPwt(spectrogram, peakLines);
    })
    .then(pwt => {
      eventHub.$emit(RECEIVED_PWT, pwt);
      resolve();
    })
    .catch(reject);
  })
}

export default postImage;