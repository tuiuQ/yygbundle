import CryptoJS from "https://esm.sh/crypto-js@4.2.0"
import type { AESDecryptionKeys } from "./types.ts";

export const aesDecryptionKeys: AESDecryptionKeys = {
  default: {
    secretPassphrase: CryptoJS.enc.Utf8.parse("53D8DBC5DIK3436A"),
    iv: CryptoJS.enc.Utf8.parse("KI5JL2SKE9883365"),
  },
  "2.0.3": {
    secretPassphrase: CryptoJS.enc.Utf8.parse("M3A8DBC5DIK9436A"),
    iv: CryptoJS.enc.Utf8.parse("KO1JL2SKE98833U5"),
  },
  "3.0.0": {
    secretPassphrase: CryptoJS.enc.Utf8.parse("B3A8PBC5DIK9436A"),
    iv: CryptoJS.enc.Utf8.parse("IO1JL2SVH98833U5"),
  },
};
