import { aesDecryptionKeys } from "./keys";
import { ECharType, type AESDecryptionVersion } from "./types";
import CryptoJS from "https://esm.sh/crypto-js@4.2.0";

export class CryptoUtil {
  static _version: AESDecryptionVersion = "default";

  static get version() {
    return this._version;
  }

  static set version(version: AESDecryptionVersion) {
    this._version = version;
  }

  static get secretPassphrase() {
    return aesDecryptionKeys[this.version].secretPassphrase;
  }

  static get iv() {
    return aesDecryptionKeys[this.version].iv;
  }

  static decrypt<T extends object | string>(encryptedStr: string, encoding: ECharType = ECharType.utf8): T {
    const decryptedStr = CryptoJS.AES.decrypt(encryptedStr, this.secretPassphrase, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);

    switch (encoding) {
      case ECharType.json:
        try {
          return JSON.parse(decryptedStr) as T
        } catch(e: any) {
          throw new Error(`JSON Parsering Error: ${e.message}`)
        }
      case ECharType.utf8:
      default:
        return decryptedStr as T;
    }
  }

  static encrypt(decryptedStr: string) {
  }
}
