import { FFT, WindowFunction } from 'dsp.js-browser';
import gainToDecibels from 'decibels/from-gain';
import { ftom } from '../utils';

/**
 * Calculate FFT on audio buffer and plot a spectrogram on canvas element.
 * @param  {AudioBuffer} audioBuffer
 * @param  {HTMLCanvasElement} canvas
 * @param  {number} _windowSize In number of samples. This will be replaced with the nearest power of 2
 * @param  {number} sr Sampling rate of audio buffer. Integer
 * @return {{freqs: Array.<number>, amp2d: Array.<Array<number>>}} freqs is frequency in Hz from low to high.
 */
const spectrogram = (audioBuffer, canvas, _windowSize, sr) => {
  const win = {};
  const originalFloatArray = audioBuffer.getChannelData(0);
  // window size must be power of 2
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

  /**
   * @param  {number} windowSize Integer
   * @param  { FFT } fft instance of FFT class of dsp.js 
   * @return { Array.<Number> } An array of center frequencies of each frequency bin.
   */
  const getCenterFreqs = (windowSize, fft) => {
    const numberOfFrequencyBins = windowSize / 2;
    // @ts-ignore
    const freqs = Array.from({ length: numberOfFrequencyBins }, (_, i) => i).map(i => fft.getBandFrequency(i));
    return freqs;
  }
  // Set up Canvas
  const ctx = canvas.getContext('2d');
  // ctx.globalCompositeOperation = 'screen';
  const SPECTROGRAM_COLOR = {
    r: 255,
    g: 255,
    b: 0
  }

  // calculate Y position of each row
  const freqs = getCenterFreqs(win.size, fft);
  const midiNoteNums = freqs.map(freq => ftom(freq));
  const highestNote = midiNoteNums[midiNoteNums.length - 1];
  const lowestNote = midiNoteNums[0];
  const rowPositions = midiNoteNums.map(noteNum => (highestNote - noteNum) / (highestNote - lowestNote));
  
  const result = {freqs, amp2d: [[]]}
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
    win.spectrum.forEach((amp, rowIdx) => {
      const rect = {}
      rect.center = {}
      rect.center.x = canvas.width * win.getCenterSampleIdx(i) / numberOfSamples;
      rect.center.y = canvas.height * rowPositions[rowIdx];
      rect.isLowestRect = rowIdx === 0;
      rect.isUpmostRect = rowIdx === numberOfRows.length - 1
      const oneLowerRectCenterY = rect.isLowestRect ? canvas.height : canvas.height * rowPositions[rowIdx - 1];
      const oneUpperRectCenterY = rect.isUpmostRect ? 0 : canvas.height * rowPositions[rowIdx + 1];
      rect.lowerEdge = {};
      rect.upperEdge = {};
      rect.lowerEdge.y = (oneLowerRectCenterY + rect.center.y) / 2;
      rect.upperEdge.y = (oneUpperRectCenterY + rect.center.y) / 2;
      rect.width = canvas.width * win.size / numberOfSamples;
      rect.height = rect.lowerEdge.y - rect.upperEdge.y;
      const blackThreshold = -78 // in dB
      const luminance = ( Math.max(gainToDecibels(amp) , blackThreshold) + Math.abs(blackThreshold) ) / Math.abs(blackThreshold);
      ctx.fillStyle = 
        'rgb(' + 
        SPECTROGRAM_COLOR.r * luminance + ', ' +  
        SPECTROGRAM_COLOR.g * luminance + ', ' +  
        SPECTROGRAM_COLOR.b * luminance + ')';
      ctx.fillRect(
        rect.center.x - rect.width / 2, 
        rect.upperEdge.y, 
        rect.width,
        rect.height
      );
    })
    i++;
    if (win.getRightEdgeSampleIdx(i) < originalFloatArray.length) {
      window.requestAnimationFrame(plotColumn);
    }
  }
  window.requestAnimationFrame(plotColumn);

  return result;
}
export default spectrogram;