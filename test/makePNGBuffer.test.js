// @ts-nocheck
import makePNGBuffer from '../src/utils/helpers/makePNGBuffer'
import fs from 'fs'

/** @return {Array.<Array.<number>>} */
const genMockGradation = (numRows, numColumns) => {
  const outerArray = new Array(numRows).fill([]).map((_, rowIdx) => {
    const innerArray = new Array(numColumns).fill(0).map((_, columnIdx) => columnIdx * rowIdx / numColumns / numRows);
    return innerArray;
  });
  return outerArray
}

test('image', () => {
  const mock = genMockGradation(10,10);
  console.log("Mock data is");
  console.log(mock);
  const buffer = makePNGBuffer(mock);
  fs.writeFileSync(__dirname + '/output/pngBuffer.png', buffer);
  // Check output file by your eyes.
});