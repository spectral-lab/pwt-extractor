import { fillBlankTime, } from '.';
import { Line, PWTConverter } from '../../classes'; // eslint-disable-line no-unused-vars

/**
 * @param {Object} resultOfSTFT 
 * @param {Array.<Line>} lines
 */
const formatAsPwt = (resultOfSTFT, lines) => {
  lines.sort((a, b) => a.startTimeIdx - b.startTimeIdx);
  const reduced = fillBlankTime(lines);
  const linesToConvert = reduced.filter((_, idx) => idx < 15);
  const pwtConverter = new PWTConverter(resultOfSTFT);
  const pwt = pwtConverter.gen(linesToConvert);
  return pwt;
}
export default formatAsPwt;