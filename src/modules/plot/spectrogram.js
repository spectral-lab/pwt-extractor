import { FFT, WindowFunction } from 'dsp.js-browser';
import gainToDecibels from 'decibels/from-gain';

// subfunction to plot spectrogram
const spectrogram = (audioBuffer, canvas, _windowSize, sr) => {
  const win = {};
  const originalFloatArray = audioBuffer.getChannelData(0);
  // window size must be a power of 2
  if ( _windowSize > originalFloatArray.length) {
    win.size = 2 ** Math.floor( Math.log2( originalFloatArray.length ) )
  } else {
    win.size = 2 ** Math.round( Math.log2( _windowSize ) )
  }
  const stepSize = win.size / 4 ;
  win.getLeftEdgeSampleIdx = windowIdx => windowIdx*stepSize;
  win.getRightEdgeSampleIdx = windowIdx => (win.size-1) + windowIdx*stepSize;
  win.getCenterSampleIdx = windowIdx => win.size/2 + windowIdx*stepSize;
  const windowFunction = new WindowFunction(7); // "7" corresponds to HANN window 
  const fft = new FFT(win.size, sr);
  // Set up Canvas
  const ctx = canvas.getContext('2d');
  // ctx.globalCompositeOperation = 'screen';
  const SPECTROGRAM_COLOR = {
    r: 225,
    g: 255,
    b: 50
  }

  let i = 0; 

  const plotColumn = () => {
    // Run windowing and FFT
    const slicedBuffer = originalFloatArray.slice(win.getLeftEdgeSampleIdx(i), win.getRightEdgeSampleIdx(i) + 1);
    const windowedBuffer = windowFunction.process(slicedBuffer);
    fft.forward(windowedBuffer);
    // @ts-ignore
    win.spectrum = fft.spectrum;
    
    // Plot rectangles
    const numberOfSamples = originalFloatArray.length;
    const numberOfRows = win.spectrum.length;
    const rect = {}
    rect.center = {}
    rect.center.x = canvas.width * win.getCenterSampleIdx(i) / numberOfSamples;
    rect.width = canvas.width * win.size / numberOfSamples;
    rect.height = canvas.height / numberOfRows;
    win.spectrum.forEach((amp, rowIdx) => {
      rect.center.y = canvas.height * (numberOfRows - 1 - rowIdx) /numberOfRows;
      const blackThreshold = -78 // in dB
      const luminance = ( Math.max(gainToDecibels(amp) , blackThreshold) + Math.abs(blackThreshold) ) / Math.abs(blackThreshold);
      ctx.fillStyle = 
        'rgb(' + 
        SPECTROGRAM_COLOR.r * luminance + ', ' +  
        SPECTROGRAM_COLOR.g * luminance + ', ' +  
        SPECTROGRAM_COLOR.b * luminance + ')';
      ctx.fillRect(
        rect.center.x - rect.width / 2, 
        rect.center.y - rect.height / 2, 
        rect.width,
        rect.height
      );
    })
    i++;
    if (win.getRightEdgeSampleIdx(i) < originalFloatArray.length) {
      window.requestAnimationFrame(plotColumn);
    }
  }

  const getFreqs = (windowSize, fft) => {
    const numberOfFrequencyBins = windowSize / 2;
    const freqs = Array.from({ length: numberOfFrequencyBins }, (_, i) => i).map(i => fft.getBandFrequency(i));
    return freqs;
  }

  console.log(getFreqs(win.size, fft));
  window.requestAnimationFrame(plotColumn);
}
export default spectrogram;