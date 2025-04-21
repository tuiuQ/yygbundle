import type { Point } from "./Point.ts";

export class Matrix {
  private a: number = 0;
  private b: number = 0;
  private c: number = 0;
  private d: number = 0;
  private tx: number = 0;
  private ty: number = 0;
  private _bTransform: boolean;
  static _createFun: ((a: number, b: number, c: number, d: number, tx: number, ty: number) => Matrix) | null = null;
  static EMPTY: Matrix = new Matrix();
  static TEMP: Matrix = new Matrix();

  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this._bTransform = false;

    if (Matrix._createFun !== null) {
      // biome-ignore lint/correctness/noConstructorReturn: 外部实现，不好调整
      return Matrix._createFun(a, b, c, d, tx, ty);
    }

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
    this._checkTransform();
  }

  public identity(): this {
    this.a = this.d = 1;
    this.b = this.tx = this.ty = this.c = 0;
    this._bTransform = false;
    return this;
  }

  private _checkTransform(): void {
    this._bTransform = this.a !== 1 || this.b !== 0 || this.c !== 0 || this.d !== 1;
  }

  public setTranslate(x: number, y: number): this {
    this.tx = x;
    this.ty = y;
    return this;
  }

  public translate(x: number, y: number): this {
    this.tx += x;
    this.ty += y;
    return this;
  }

  public scale(scaleX: number, scaleY: number): this {
    this.a *= scaleX;
    this.d *= scaleY;
    this.c *= scaleX;
    this.b *= scaleY;
    this.tx *= scaleX;
    this.ty *= scaleY;
    this._bTransform = true;
    return this;
  }

  public rotate(angle: number): this {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const oldA = this.a;
    const oldC = this.c;
    const oldTx = this.tx;
    this.a = oldA * cos - this.b * sin;
    this.b = oldA * sin + this.b * cos;
    this.c = oldC * cos - this.d * sin;
    this.d = oldC * sin + this.d * cos;
    this.tx = oldTx * cos - this.ty * sin;
    this.ty = oldTx * sin + this.ty * cos;
    this._bTransform = true;
    return this;
  }

  public skew(skewX: number, skewY: number): this {
    const tanX = Math.tan(skewX);
    const tanY = Math.tan(skewY);
    const oldA = this.a;
    const oldB = this.b;
    this.a += tanY * this.c;
    this.b += tanY * this.d;
    this.c += tanX * oldA;
    this.d += tanX * oldB;
    return this;
  }

  public invertTransformPoint(point: Point): Point {
    const { x, y } = point;
    const det = this.a * this.d - this.b * this.c;
    const invDet = 1 / det;
    const invA = this.d * invDet;
    const invB = -this.b * invDet;
    const invC = -this.c * invDet;
    const invD = this.a * invDet;
    const invTx = (this.c * this.ty - this.d * this.tx) * invDet;
    const invTy = -(this.a * this.ty - this.b * this.tx) * invDet;
    return point.setTo(invA * x + invC * y + invTx, invB * x + invD * y + invTy);
  }

  public transformPoint(point: Point): Point {
    const { x, y } = point;
    return point.setTo(this.a * x + this.c * y + this.tx, this.b * x + this.d * y + this.ty);
  }

  public transformPointN(point: Point): Point {
    const { x, y } = point;
    return point.setTo(this.a * x + this.c * y, this.b * x + this.d * y);
  }

  public getScaleX(): number {
    return this.b === 0 ? this.a : Math.sqrt(this.a * this.a + this.b * this.b);
  }

  public getScaleY(): number {
    return this.c === 0 ? this.d : Math.sqrt(this.c * this.c + this.d * this.d);
  }

  public invert(): this {
    const oldA = this.a;
    const oldB = this.b;
    const oldC = this.c;
    const oldD = this.d;
    const oldTx = this.tx;
    const det = oldA * oldD - oldB * oldC;
    const invDet = 1 / det;
    this.a = oldD * invDet;
    this.b = -oldB * invDet;
    this.c = -oldC * invDet;
    this.d = oldA * invDet;
    this.tx = (oldC * this.ty - oldD * oldTx) * invDet;
    this.ty = -(oldA * this.ty - oldB * oldTx) * invDet;
    return this;
  }
  setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): this {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
    return this;
  }

  concat(matrix: Matrix): this {
    const currentA = this.a;
    const currentC = this.c;
    const currentTX = this.tx;

    this.a = currentA * matrix.a + this.b * matrix.c;
    this.b = currentA * matrix.b + this.b * matrix.d;
    this.c = currentC * matrix.a + this.d * matrix.c;
    this.d = currentC * matrix.b + this.d * matrix.d;
    this.tx = currentTX * matrix.a + this.ty * matrix.c + matrix.tx;
    this.ty = currentTX * matrix.b + this.ty * matrix.d + matrix.ty;
    return this;
  }

  static mul(matrix1: Matrix, matrix2: Matrix, result: Matrix): Matrix {
    const currentA = matrix1.a;
    const currentB = matrix1.b;
    const currentC = matrix1.c;
    const currentD = matrix1.d;
    const currentTX = matrix1.tx;
    const currentTY = matrix1.ty;
    const otherA = matrix2.a;
    const otherB = matrix2.b;
    const otherC = matrix2.c;
    const otherD = matrix2.d;
    const otherTX = matrix2.tx;
    const otherTY = matrix2.ty;

    if (otherB !== 0 || otherC !== 0) {
      result.a = currentA * otherA + currentB * otherC;
      result.b = currentA * otherB + currentB * otherD;
      result.c = currentC * otherA + currentD * otherC;
      result.d = currentC * otherB + currentD * otherD;
      result.tx = otherA * currentTX + otherC * currentTY + otherTX;
      result.ty = otherB * currentTX + otherD * currentTY + otherTY;
    } else {
      result.a = currentA * otherA;
      result.b = currentB * otherD;
      result.c = currentC * otherA;
      result.d = currentD * otherD;
      result.tx = otherA * currentTX + otherTX;
      result.ty = otherD * currentTY + otherTY;
    }

    return result;
  }

  static mul16(matrix1: Matrix, matrix2: Matrix, result: number[]): number[] {
    const currentA = matrix1.a;
    const currentB = matrix1.b;
    const currentC = matrix1.c;
    const currentD = matrix1.d;
    const currentTX = matrix1.tx;
    const currentTY = matrix1.ty;
    const otherA = matrix2.a;
    const otherB = matrix2.b;
    const otherC = matrix2.c;
    const otherD = matrix2.d;
    const otherTX = matrix2.tx;
    const otherTY = matrix2.ty;

    if (otherB !== 0 || otherC !== 0) {
      result[0] = currentA * otherA + currentB * otherC;
      result[1] = currentA * otherB + currentB * otherD;
      result[4] = currentC * otherA + currentD * otherC;
      result[5] = currentC * otherB + currentD * otherD;
      result[12] = otherA * currentTX + otherC * currentTY + otherTX;
      result[13] = otherB * currentTX + otherD * currentTY + otherTY;
    } else {
      result[0] = currentA * otherA;
      result[1] = currentB * otherD;
      result[4] = currentC * otherA;
      result[5] = currentD * otherD;
      result[12] = otherA * currentTX + otherTX;
      result[13] = otherD * currentTY + otherTY;
    }

    return result;
  }
  scaleEx(scaleX: number, scaleY: number): void {
    const currentA = this.a;
    const currentB = this.b;
    const currentC = this.c;
    const currentD = this.d;

    if (currentB !== 0 || currentC !== 0) {
      this.a = scaleX * currentA;
      this.b = scaleX * currentB;
      this.c = scaleY * currentC;
      this.d = scaleY * currentD;
    } else {
      this.a = scaleX * currentA;
      this.b = 0 * currentD;
      this.c = 0 * currentA;
      this.d = scaleY * currentD;
    }

    this._bTransform = true;
  }

  rotateEx(angle: number): void {
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const currentA = this.a;
    const currentB = this.b;
    const currentC = this.c;
    const currentD = this.d;

    if (currentB !== 0 || currentC !== 0) {
      this.a = cosAngle * currentA + sinAngle * currentC;
      this.b = cosAngle * currentB + sinAngle * currentD;
      this.c = -sinAngle * currentA + cosAngle * currentC;
      this.d = -sinAngle * currentB + cosAngle * currentD;
    } else {
      this.a = cosAngle * currentA;
      this.b = sinAngle * currentD;
      this.c = -sinAngle * currentA;
      this.d = cosAngle * currentD;
    }

    this._bTransform = true;
  }

  clone(): Matrix {
    const clonedMatrix = new Matrix();
    clonedMatrix.a = this.a;
    clonedMatrix.b = this.b;
    clonedMatrix.c = this.c;
    clonedMatrix.d = this.d;
    clonedMatrix.tx = this.tx;
    clonedMatrix.ty = this.ty;
    clonedMatrix._bTransform = this._bTransform;
    return clonedMatrix;
  }

  copyTo(target: Matrix): Matrix {
    target.a = this.a;
    target.b = this.b;
    target.c = this.c;
    target.d = this.d;
    target.tx = this.tx;
    target.ty = this.ty;
    target._bTransform = this._bTransform;
    return target;
  }

  toString(): string {
    return `${this.a},${this.b},${this.c},${this.d},${this.tx},${this.ty}`;
  }

  destroy(): void {
    this.recover();
  }

  recover(): void {
    // Implementation specific to your codebase
  }

  static create(): Matrix {
    return new Matrix();
  }
}

