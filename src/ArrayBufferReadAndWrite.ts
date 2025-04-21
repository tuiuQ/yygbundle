import { Matrix } from "./Matrix.ts";

export class ArrayBufferReadAndWrite {
  _xd_: boolean;
  _allocated_: number;
  _pos_: number;
  _length: number;
  _u8d_: Uint8Array = new Uint8Array();
  _d_: DataView = new DataView(this._u8d_.buffer);
  constructor(arrayBuffer: ArrayBuffer | null = null) {
    this._xd_ = !0;
    this._allocated_ = 8;
    this._pos_ = 0;
    this._length = 0;

    if (arrayBuffer) {
      this._u8d_ = new Uint8Array(arrayBuffer);
      this._d_ = new DataView(this._u8d_.buffer);
      this._length = this._d_.byteLength;
    } else {
      this._resizeBuffer(this._allocated_);
    }
  }

  static LITTLE_ENDIAN = "littleEndian";
  static BIG_ENDIAN = "bigEndian";
  static _sysEndian: string | null = null;

  static getSystemEndian() {
    if (!ArrayBufferReadAndWrite._sysEndian) {
      const buffer = new ArrayBuffer(2);
      new DataView(buffer).setInt16(0, 256, !0);
      ArrayBufferReadAndWrite._sysEndian =
        256 === new Int16Array(buffer)[0] ? ArrayBufferReadAndWrite.LITTLE_ENDIAN : ArrayBufferReadAndWrite.BIG_ENDIAN;
    }
    return ArrayBufferReadAndWrite._sysEndian;
  }

  get buffer() {
    const buffer = this._d_.buffer;
    return buffer.byteLength === this._length ? buffer : buffer.slice(0, this._length);
  }

  get endian() {
    return this._xd_ ? ArrayBufferReadAndWrite.LITTLE_ENDIAN : ArrayBufferReadAndWrite.BIG_ENDIAN;
  }

  set endian(value) {
    this._xd_ = value === ArrayBufferReadAndWrite.LITTLE_ENDIAN;
  }

  set length(value) {
    if (this._allocated_ < value) {
      this._allocated_ = Math.floor(Math.max(value, 2 * this._allocated_));
      this._resizeBuffer(this._allocated_);
    } else {
      this._allocated_ = value;
      this._allocated_ > value && this._resizeBuffer(this._allocated_);
    }

    this._length = value;
  }

  get length() {
    return this._length;
  }

  _resizeBuffer(len: number) {
    try {
      const uint8Array = new Uint8Array(len);
      null != this._u8d_ &&
        (this._u8d_.length <= len ? uint8Array.set(this._u8d_) : uint8Array.set(this._u8d_.subarray(0, len)));
      this._u8d_ = uint8Array;
      this._d_ = new DataView(uint8Array.buffer);
    } catch (_err) {
      throw `Invalid typed array length:${len}`;
    }
  }

  getString() {
    return this.readString();
  }

  readString() {
    return this._rUTF(this.getUint16());
  }

  getFloat32Array(start: number, length: number) {
    return this.readFloat32Array(start, length);
  }

  readFloat32Array(start: number, length: number) {
    let end = start + length;
    end = end > this._length ? this._length : end;
    const array = new Float32Array(this._d_.buffer.slice(start, end));
    this._pos_ = end;
    return array;
  }

  getUint8Array(start: number, length: number) {
    return this.readUint8Array(start, length);
  }

  readUint8Array(start: number, length: number) {
    let end = start + length;
    end = end > this._length ? this._length : end;
    const array = new Uint8Array(this._d_.buffer.slice(start, end));
    this._pos_ = end;
    return array;
  }

  getInt16Array(start: number, length: number) {
    return this.readInt16Array(start, length);
  }

  readInt16Array(start: number, length: number) {
    let end = start + length;
    end = end > this._length ? this._length : end;
    const array = new Int16Array(this._d_.buffer.slice(start, end));
    this._pos_ = end;
    return array;
  }

  getFloat32() {
    return this.readFloat32();
  }

  readFloat32() {
    const value = this._d_.getFloat32(this._pos_, this._xd_);
    this._pos_ += 4;
    return value;
  }

  getFloat64() {
    return this.readFloat64();
  }

  readFloat64() {
    if (this._pos_ + 8 > this._length) {
      throw "getFloat64 error - Out of bounds";
    }
    const value = this._d_.getFloat64(this._pos_, this._xd_);
    this._pos_ += 8;
    return value;
  }

  writeFloat32(value: number) {
    this._ensureWrite(this._pos_ + 4);
    this._d_.setFloat32(this._pos_, value, this._xd_);
    this._pos_ += 4;
  }

  writeFloat64(value: number) {
    this._ensureWrite(this._pos_ + 8);
    this._d_.setFloat64(this._pos_, value, this._xd_);
    this._pos_ += 8;
  }

  getInt32() {
    return this.readInt32();
  }

  readInt32() {
    if (this._pos_ + 4 > this._length) {
      throw "getInt32 error - Out of bounds";
    }
    const value = this._d_.getInt32(this._pos_, this._xd_);
    this._pos_ += 4;
    return value;
  }

  getUint32() {
    return this.readUint32();
  }

  readUint32() {
    if (this._pos_ + 4 > this._length) {
      throw "getUint32 error - Out of bounds";
    }
    const value = this._d_.getUint32(this._pos_, this._xd_);
    this._pos_ += 4;
    return value;
  }

  writeInt32(value: number) {
    this._ensureWrite(this._pos_ + 4);
    this._d_.setInt32(this._pos_, value, this._xd_);
    this._pos_ += 4;
  }

  writeUint32(value: number) {
    this._ensureWrite(this._pos_ + 4);
    this._d_.setUint32(this._pos_, value, this._xd_);
    this._pos_ += 4;
  }

  getInt16() {
    return this.readInt16();
  }

  readInt16() {
    const value = this._d_.getInt16(this._pos_, this._xd_);
    this._pos_ += 2;
    return value;
  }

  getUint16() {
    return this.readUint16();
  }

  readUint16() {
    if (this._pos_ + 2 > this._length) {
      throw "getUint16 error - Out of bounds";
    }
    const value = this._d_.getUint16(this._pos_, this._xd_);
    this._pos_ += 2;
    return value;
  }

  writeUint16(value: number) {
    this._ensureWrite(this._pos_ + 2);
    this._d_.setUint16(this._pos_, value, this._xd_);
    this._pos_ += 2;
  }

  writeInt16(value: number) {
    this._ensureWrite(this._pos_ + 2);
    this._d_.setInt16(this._pos_, value, this._xd_);
    this._pos_ += 2;
  }

  getUint8(): number {
    return this.readUint8();
  }

  readUint8(): number {
    if (this._pos_ + 1 > this._length) {
      throw "getUint8 error - Out of bounds";
    }
    return this._u8d_[this._pos_++];
  }

  writeUint8(value: number): void {
    this._ensureWrite(this._pos_ + 1);
    this._d_.setUint8(this._pos_, value);
    this._pos_++;
  }

  _getUInt8(position: number): number {
    return this._readUInt8(position);
  }

  _readUInt8(position: number): number {
    return this._d_.getUint8(position);
  }

  _getUint16(position: number): number {
    return this._readUint16(position);
  }

  _readUint16(position: number): number {
    return this._d_.getUint16(position, this._xd_);
  }

  _getMatrix(): Matrix {
    return this._readMatrix();
  }

  _readMatrix() {
    return new Matrix(
      this.getFloat32(),
      this.getFloat32(),
      this.getFloat32(),
      this.getFloat32(),
      this.getFloat32(),
      this.getFloat32(),
    );
  }

  _rUTF(length: number) {
    let charCode: number;
    let char: number;
    const end = this._pos_ + length;
    const fromCharCode = String.fromCharCode;
    const data = this._u8d_;
    const result: string[] = [];
    let resultLength = 0;
    for (result.length = 1000; this._pos_ < end; ) {
      charCode = data[this._pos_++];
      if (charCode < 128) {
        if (0 !== charCode) {
          result[resultLength++] = fromCharCode(charCode);
        }
      } else {
        if (charCode < 224) {
          result[resultLength++] = fromCharCode(((63 & charCode) << 6) | (127 & data[this._pos_++]));
        } else {
          if (charCode < 240) {
            char = data[this._pos_++];
            result[resultLength++] = fromCharCode(
              ((31 & charCode) << 12) | ((127 & char) << 6) | (127 & data[this._pos_++]),
            );
          } else {
            char = data[this._pos_++];
            const _0x41bab3 =
              ((15 & charCode) << 18) |
              ((127 & char) << 12) |
              ((127 & data[this._pos_++]) << 6) |
              (127 & data[this._pos_++]);
            if (_0x41bab3 >= 65536) {
              const _0x30a893 = _0x41bab3 - 65536;
              const _0x2ed4d9 = 55296 | (_0x30a893 >> 10);
              const _0x5069ad = 56320 | (1023 & _0x30a893);
              result[resultLength++] = fromCharCode(_0x2ed4d9);
              result[resultLength++] = fromCharCode(_0x5069ad);
            } else {
              result[resultLength++] = fromCharCode(_0x41bab3);
            }
          }
        }
      }
    }
    result.length = resultLength;
    return result.join("");
  }

  getCustomString(_0x29f6d8: number) {
    return this.readCustomString(_0x29f6d8);
  }

  readCustomString(length: number): string {
    let currentChar: number;
    let result = "";
    let count = 0;
    const fromCharCode = String.fromCharCode;
    const data = this._u8d_;
    let remainingLength = length;

    while (remainingLength > 0) {
      currentChar = data[this._pos_];
      if (currentChar < 128) {
        result += fromCharCode(currentChar);
        this._pos_++;
        remainingLength--;
      } else {
        count = currentChar - 128;
        this._pos_++;
        remainingLength -= count;
        while (count > 0) {
          currentChar = data[this._pos_++];
          result += fromCharCode((data[this._pos_++] << 8) | currentChar);
          count--;
        }
      }
    }
    return result;
  }

  get pos() {
    return this._pos_;
  }

  set pos(_0x59e81c) {
    this._pos_ = _0x59e81c;
  }

  get bytesAvailable() {
    return this._length - this._pos_;
  }

  clear() {
    this._pos_ = 0;
    this.length = 0;
  }

  __getBuffer() {
    return this._d_.buffer;
  }

  writeUTFBytes(text: string) {
    const modifiedText = `${text}`;
    for (let i = 0, len = modifiedText.length; i < len; i++) {
      const charCode = modifiedText.charCodeAt(i);
      if (charCode <= 127) {
        this.writeByte(charCode);
      } else {
        if (charCode <= 2047) {
          this._ensureWrite(this._pos_ + 2);
          this._u8d_.set([192 | (charCode >> 6), 128 | (63 & charCode)], this._pos_);
          this._pos_ += 2;
        } else {
          if (charCode >= 55296 && charCode <= 56319) {
            i++;
            const nextCharCode = modifiedText.charCodeAt(i);
            if (!Number.isNaN(nextCharCode) && nextCharCode >= 56320 && nextCharCode <= 57343) {
              const highBits = 64 + (1023 & charCode);
              const lowBits = 1023 & nextCharCode;
              const byte1 = 240 | ((highBits >> 8) & 63);
              const byte2 = 128 | ((highBits >> 2) & 63);
              const byte3 = 128 | ((3 & highBits) << 4) | ((lowBits >> 6) & 15);
              const byte4 = 128 | (63 & lowBits);
              this._ensureWrite(this._pos_ + 4);
              this._u8d_.set([byte1, byte2, byte3, byte4], this._pos_);
              this._pos_ += 4;
            }
          } else {
            if (charCode <= 65535) {
              this._ensureWrite(this._pos_ + 3);
              this._u8d_.set([224 | (charCode >> 12), 128 | ((charCode >> 6) & 63), 128 | (63 & charCode)], this._pos_);
              this._pos_ += 3;
            } else {
              this._ensureWrite(this._pos_ + 4);
              this._u8d_.set(
                [
                  240 | (charCode >> 18),
                  128 | ((charCode >> 12) & 63),
                  128 | ((charCode >> 6) & 63),
                  128 | (63 & charCode),
                ],
                this._pos_,
              );
              this._pos_ += 4;
            }
          }
        }
      }
    }
  }

  writeUTFString(_0x240842: string) {
    const _0x44f739 = this.pos;
    this.writeUint16(1);
    this.writeUTFBytes(_0x240842);
    const _0x36a3d5 = this.pos - _0x44f739 - 2;
    this._d_.setUint16(_0x44f739, _0x36a3d5, this._xd_);
  }

  readUTFString() {
    return this.readUTFBytes(this.getUint16());
  }

  getUTFString() {
    return this.readUTFString();
  }

  readUTFBytes(length = -1) {
    if (0 === length) {
      return "";
    }
    const bytesAvailable = this.bytesAvailable;
    if (length > bytesAvailable) {
      throw "readUTFBytes error - Out of bounds";
    }
    const finalLength = length > 0 ? length : bytesAvailable;
    return this._rUTF(finalLength);
  }

  getUTFBytes(_0x1c8504 = -1) {
    return this.readUTFBytes(_0x1c8504);
  }

  writeByte(_0x51aa64: number) {
    this._ensureWrite(this._pos_ + 1);
    this._d_.setInt8(this._pos_, _0x51aa64);
    this._pos_ += 1;
  }

  readByte() {
    if (this._pos_ + 1 > this._length) {
      throw "readByte error - Out of bounds";
    }
    return this._d_.getInt8(this._pos_++);
  }

  getByte() {
    return this.readByte();
  }

  _ensureWrite(writeLength: number) {
    if (this._length < writeLength) {
      this._length = writeLength;
    }
    if (this._allocated_ < writeLength) {
      this.length = writeLength;
    }
  }

  writeArrayBuffer(_0x38dc2e: ArrayBuffer, _0x19a673 = 0, length = 0) {
    if (_0x19a673 < 0 || length < 0) {
      throw "writeArrayBuffer error - Out of bounds";
    }
    const finalLength = length === 0 ? _0x38dc2e.byteLength - _0x19a673 : length;
    this._ensureWrite(this._pos_ + finalLength);
    const _0x2bded7 = new Uint8Array(_0x38dc2e);
    this._u8d_.set(_0x2bded7.subarray(_0x19a673, _0x19a673 + finalLength), this._pos_);
    this._pos_ += finalLength;
  }

  readArrayBuffer(size: number) {
    const buffer = this._u8d_.buffer.slice(this._pos_, this._pos_ + size) as ArrayBuffer;
    this._pos_ = this._pos_ + size;
    return buffer;
  }
}

