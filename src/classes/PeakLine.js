/** Class representing a line which contains points detected as peak. */
class PeakLine {
  /**
   * @param {Array.<Array.<number>>} points - Points in the Peak Line. Each point is a pair of [row, column]
   * @param {number} id - id.
   */
  constructor(points, id) {
    const firstPoint = points[0];
    const lastPoint = points[points.length-1];
    this.id= id;
    this.startTimeIdx= firstPoint[1];
    this.endTimeIdx= lastPoint[1];
    this.points= points;
    this.numberOfPoints= points.length;
  }
}

export default PeakLine;