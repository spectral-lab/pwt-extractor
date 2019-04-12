/** Class representing a line which contains points detected as peak. */
class Line {
  /**
   * @param {Array.<Array.<number>>} points - Points to be the line. Each point is a pair of [row, column]
   * @param {number} id - line id.
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

export default Line;