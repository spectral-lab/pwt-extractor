import { fillBlankTime, genPWT } from '.';
import { PeakLine } from '../../classes'; // eslint-disable-line no-unused-vars

/**
 * @param {Object} resultOfSTFT 
 * @param {Array.<PeakLine>} lines
 */
const formatAsPwt = (resultOfSTFT, lines) => {
  lines.sort((a, b) => a.startTimeIdx - b.startTimeIdx);
  const reduced = fillBlankTime(lines);
  const linesToConvert = reduced.filter((_, idx) => idx < 15);
  const pwt = genPWT(resultOfSTFT, linesToConvert);
  return pwt;
}
export default formatAsPwt;