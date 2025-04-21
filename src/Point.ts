export class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  setTo(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }
}

