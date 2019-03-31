import pack from 'ndarray-pack'
import normalize from 'ndarray-normalize'
import unpack from 'ndarray-unpack'
const normalize2d = (array2d) => {
  const ndarray = pack(array2d);
  const normalized = normalize(ndarray);
  return unpack(normalized);
}

export default normalize2d;