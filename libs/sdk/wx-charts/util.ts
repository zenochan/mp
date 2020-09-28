export class Util {

  static toFixed(num, limit = 2) {
    if (this.isFloat(num)) {
      num = num.toFixed(limit);
    }
    return num;
  }

  static isFloat(num) {
    return num % 1 !== 0;
  }

  static approximatelyEqual(num1, num2) {
    return Math.abs(num1 - num2) < 1e-10;
  }

  static isSameSign(num1, num2) {
    return (Math.abs(num1) === num1 && Math.abs(num2) === num2)
      || (Math.abs(num1) !== num1 && Math.abs(num2) !== num2)
  }

  static isSameXCoordinateArea(p1, p2) {
    return this.isSameSign(p1.x, p2.x);
  }

  static isCollision(obj1, obj2) {
    obj1.end = {};
    obj1.end.x = obj1.start.x + obj1.width;
    obj1.end.y = obj1.start.y - obj1.height;
    obj2.end = {};
    obj2.end.x = obj2.start.x + obj2.width;
    obj2.end.y = obj2.start.y - obj2.height;

    let flag = obj2.start.x > obj1.end.x
      || obj2.end.x < obj1.start.x
      || obj2.end.y > obj1.start.y
      || obj2.start.y < obj1.end.y;

    return !flag;
  }
}

