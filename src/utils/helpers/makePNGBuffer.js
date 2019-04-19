import { PNG } from 'pngjs';
import gainToDecibels from 'decibels/from-gain';

const makePNGBuffer = (spectrogram) => {
  const png = new PNG({
    width: spectrogram.magnitude2d[0].length,
    height: spectrogram.magnitude2d.length,
    bitDepth: 8,
    colorType: 0,
    inputHasAlpha: false
  });
  png.data = spectrogram.magnitude2d.flat().map(magnitude => {
    const blackThreshold = -78 // in dB
    const db = gainToDecibels(magnitude);
    const filterLow = Math.max(db, blackThreshold);
    const normalized = (filterLow + Math.abs(blackThreshold))  / Math.abs(blackThreshold)
    const ret = Math.round(normalized * 255);
    return ret;
  });
  return PNG.sync.write(png);
}

export default makePNGBuffer;