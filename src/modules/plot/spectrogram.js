// subfunction to plot spectrogram
import {DFT, WindowFunction} from 'dsp.js-browser';
const spectrogram = (audioBuffer, canvas, _windowSize, sr) => {
  const win = {};
  win.size = Math.round( _windowSize / 4) * 4;
  const originalFloatArray = audioBuffer.getChannelData(0);
  const stepSize = win.size / 4 ;
  win.getLeftEdgeSampleIdx = i => i*stepSize;
  win.getRightEdgeSampleIdx = i => (win.size-1) + i*stepSize;
  win.getCenterSampleIdx = i => win.size/2 + i*stepSize;
  const windowFunction = new WindowFunction(7); // "7" corresponds to HANN window 
  const dft = new DFT(win.size, sr);

  // Set up Canvas
  const ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'screen';
  const SPECTROGRAM_COLOR = {
    r: 160,
    g: 255,
    b: 160
  }

  for (let i = 0; win.getRightEdgeSampleIdx(i) < originalFloatArray.length; i++) {
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
    rect.width = canvas.width * win.size / numberOfSamples * 0.001;
    rect.height = canvas.height / numberOfRows * 0.001;
    win.spectrum.forEach((amp, rowIdx) => {
      rect.center.y = canvas.height * rowIdx /numberOfRows;
      ctx.fillStyle = 
        'rgb(' + 
        SPECTROGRAM_COLOR.r * amp + ', ' +  
        SPECTROGRAM_COLOR.g * amp + ', ' +  
        SPECTROGRAM_COLOR.b * amp + ')';
      ctx.fillRect(
        rect.center.x - rect.width / 2, 
        rect.center.y - rect.height / 2, 
        rect.center.x + rect.width / 2, 
        rect.center.y + rect.height / 2
      );
    })
  }

  
  
}

export default spectrogram;