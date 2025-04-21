import CryptoJS from "crypto-js";

export type AESDecryptionVersion = "default" | "2.0.3" | "3.0.0";
export interface AESDecryptionKey {
  secretPassphrase: CryptoJS.lib.WordArray;
  iv: CryptoJS.lib.WordArray;
}
export type AESDecryptionKeys = {
  [version in AESDecryptionVersion]: AESDecryptionKey;
};

export const enum ECharType {
  utf8 = "utf8",
  json = "json",
}
