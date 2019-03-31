// subfunction to plot waveform
import pack from 'ndarray-pack'
const spectrogram = (amp2d, canvas) => {
  debugger;
  const SPECTROGRAM_COLOR = 'rgb(80, 180, 80)';
  const ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = SPECTROGRAM_COLOR;
  ctx.fillRect(0, 0, 100, 100);
  debugger;
}

export default spectrogram;