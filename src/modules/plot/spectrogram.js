// subfunction to plot waveform
import pack from 'ndarray-pack'
const spectrogram = (audioBuffer, canvas) => {
  const audioCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  )
  debugger;
  const SPECTROGRAM_COLOR = 'rgb(80, 180, 80)';
  const canvasCtx = canvas.getContext('2d');
  canvasCtx.globalCompositeOperation = 'screen';
  canvasCtx.fillStyle = SPECTROGRAM_COLOR;
  canvasCtx.fillRect(0, 0, 100, 100);
}

export default spectrogram;