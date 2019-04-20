import { PNG } from 'pngjs';
import gainToDecibels from 'decibels/from-gain';
/**
 * @param  {Array.<Array.<number>>} imgAs2dArray Each element is in range from 0. to 1
 */
const makePNGBuffer = (imgAs2dArray) => {
  const png = new PNG({
    width: imgAs2dArray[0].length,
    height: imgAs2dArray.length,
    bitDepth: 8,
    colorType: 0,
    inputHasAlpha: false
  });
  // @ts-ignore
  png.data = imgAs2dArray.flat().map(magnitude => {
    // const blackThreshold = -78 // in dB
    // const db = gainToDecibels(magnitude);
    // const filterLow = Math.max(db, blackThreshold);
    // const normalized = (filterLow + Math.abs(blackThreshold))  / Math.abs(blackThreshold)
    const normalized = magnitude;
    const ret = Math.round(normalized * 255.);
    return ret;
  });
  return PNG.sync.write(png, { 
    colorType: 0 
  });
}

export default makePNGBuffer;