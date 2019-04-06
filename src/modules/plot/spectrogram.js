import { DFT, WindowFunction } from 'dsp.js-browser';
import gainToDecibels from 'decibels/from-gain';

// subfunction to plot spectrogram
const spectrogram = (audioBuffer, canvas, _windowSize, sr) => {
  debugger;
  const win = {};
  win.size = Math.round( _windowSize / 4) * 4;
  const originalFloatArray = audioBuffer.getChannelData(0);
  const stepSize = win.size / 4 ;
  win.getLeftEdgeSampleIdx = i => i*stepSize;
  win.getRightEdgeSampleIdx = i => (win.size-1) + i*stepSize;
  win.getCenterSampleIdx = i => win.size/2 + i*stepSize;
  const windowFunction = new WindowFunction(7); // "7" corresponds to HANN window 
  const dft = new DFT(win.size, sr);
  debugger;
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
    if (win.getRightEdgeSampleIdx(i) < originalFloatArray.length) {
      // Run windowing and DFT
      const slicedBuffer = originalFloatArray.slice(win.getLeftEdgeSampleIdx(i), win.getRightEdgeSampleIdx(i) + 1);
      const windowedBuffer = windowFunction.process(slicedBuffer);
      dft.forward(windowedBuffer);
      // @ts-ignore
      win.spectrum = dft.spectrum;
      
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
    }; 
    i++;
    window.requestAnimationFrame(plotColumn);
  }
  
  window.requestAnimationFrame(plotColumn);
}
export default spectrogram;