export class Timing {
  static easeIn(pos) {
    return Math.pow(pos, 3);
  }

  static easeOut(pos) {
    return (Math.pow((pos - 1), 3) + 1);
  }

  static easeInOut(pos) {
    if ((pos /= 0.5) < 1) {
      return 0.5 * Math.pow(pos, 3);
    } else {
      return 0.5 * (Math.pow((pos - 2), 3) + 2);
    }
  }


  static linear(pos) {
    return pos;
  }
}
