import { FFT, WindowFunction } from 'dsp.js-browser';
import gainToDecibels from 'decibels/from-gain';
import { ftom } from '../helpers';
import packIntoNdarray from 'ndarray-pack';
import unpackFromNdArray from 'ndarray-unpack'

/**
 * Calculate STFT, Short Time Fourier Transform, on audio buffer and plot a spectrogram on canvas element.
 * @param  {AudioBuffer} audioBuffer
 * @param  {HTMLCanvasElement} canvas
 * @param  {number} _windowSize In number of samples. This will be replaced with the nearest power of 2
 * @param  {number} sr Sampling rate of audio buffer. Integer
 * @return {Promise.<{times: Array.<number>, freqs: Array.<number>, magnitude2d: Array.<Array<number>>}>} freqs is decimal values in Hz. From low to high. magnitude2d is decimals from 0. to 1. From low freq to high freq. 
 */
const spectrogram = (audioBuffer, canvas, _windowSize, sr) => new Promise(resolve => {
  const win = {};
  const originalFloatArray = audioBuffer.getChannelData(0);
  
  // NEED REFACTOR
  // window size must be power of 2
  // minimum value is 8
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

  // calculate Y position of each row
  const freqs = getCenterFreqs(win.size, fft);
  const midiNoteNums = freqs.map(freq => ftom(freq));
  const highestNote = midiNoteNums[midiNoteNums.length - 1];
  const lowestNote = midiNoteNums[0];
  const rowPositions = midiNoteNums.map(noteNum => (highestNote - noteNum) / (highestNote - lowestNote));

  const resultOfSTFT = {
    times: [], 
    freqs: freqs, 
    magnitude2d: null
  }
  let i = 0; 
  /**@type {Array.<Array>} Array of spectrum (magnitude values from low freq bin to high freq bin)  */
  const spectra = [];
  const plotColumn = () => {
    // Run windowing and FFT
    const slicedBuffer = originalFloatArray.slice(win.getLeftEdgeSampleIdx(i), win.getRightEdgeSampleIdx(i) + 1);
    resultOfSTFT.times.push(win.getCenterSampleIdx(i) / sr);
    const windowedBuffer = windowFunction.process(slicedBuffer);
    fft.forward(windowedBuffer);
    // @ts-ignore
    win.spectrum = fft.spectrum;
    spectra.push(Array.from(win.spectrum));
    // spectra.push(fft.spectrum)
    
    // Plot rectangles
    /** @type {number} How many samples is in the original buffer  */
    const numberOfSamples = originalFloatArray.length;
    const numberOfRows = win.spectrum.length;
    win.spectrum.forEach((magnitude, rowIdx) => {
      const blackThreshold = -78 // in dB
      const rect = {
        center: {
          x: canvas.width * win.getCenterSampleIdx(i) / numberOfSamples,
          y: canvas.height * rowPositions[rowIdx]
        },
        isLowestRect: rowIdx === 0,
        isUpmostRect: rowIdx === numberOfRows.length - 1,
        luminance: ( Math.max(gainToDecibels(magnitude) , blackThreshold) + Math.abs(blackThreshold) ) / Math.abs(blackThreshold),
      }
      const oneLowerRectCenterY = rect.isLowestRect ? canvas.height : canvas.height * rowPositions[rowIdx - 1];
      const oneUpperRectCenterY = rect.isUpmostRect ? 0 : canvas.height * rowPositions[rowIdx + 1];
      rect.lowerEdge = {
        y: (oneLowerRectCenterY + rect.center.y) / 2
      };
      rect.upperEdge = {
        y: (oneUpperRectCenterY + rect.center.y) / 2
      };
      rect.width = canvas.width * win.size / numberOfSamples;
      rect.height = rect.lowerEdge.y - rect.upperEdge.y;
      const HUE = 200;
      ctx.globalAlpha = rect.luminance;
      ctx.fillStyle = `hsl(${HUE},100%,${rect.luminance * 100}%)`
        
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
    } else {
      resultOfSTFT.magnitude2d = unpackFromNdArray(packIntoNdarray(spectra).transpose(1, 0));  
      resolve(resultOfSTFT);
    }
  }

  window.requestAnimationFrame(plotColumn);
})
export default spectrogram;