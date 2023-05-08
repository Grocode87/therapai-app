import * as SecureStore from "expo-secure-store";
import RNSimpleCrypto from "react-native-simple-crypto";
import CryptoES from "crypto-es";

import {
  AES_GCM,
  getRandomValues,
  toByteArray,
  fromByteArray,
} from "expo-crypto";

export async function deriveAndStoreKey(phoneNumber, uid) {
  const iterations = 10000; // choose a suitable number of iterations
  const keyLength = 32; // or any desired key length

  console.log("starting PBKDF2");

  const key = CryptoES.PBKDF2(phoneNumber, uid, {
    keySize: 32,
    iterations: 100,
  });
  console.log("PBKDF2 passwordKey", key.toString());

  console.log("key generated, storing");

  await SecureStore.setItemAsync("key_test", key.toString());
}

export async function getKey() {
  const key = await SecureStore.getItemAsync("key_test");
  return key;
}

export async function encryptString(plainText) {
  const key = await SecureStore.getItemAsync("key_test");

  const encrypted = CryptoES.AES.encrypt(plainText, key).toString();

  return encrypted;
}

export async function decryptString(cipherText) {
  const key = await SecureStore.getItemAsync("key_test");

  const decrypted = CryptoES.AES.decrypt(cipherText, key).toString(
    CryptoES.enc.Utf8
  );

  return decrypted;
}
