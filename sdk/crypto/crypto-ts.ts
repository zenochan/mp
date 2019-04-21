// DEPENDENCIES ////////////////////////////////////////////////////////////////////////////////////

// import indirectly referenced declarations
import {WordArray} from './lib/WordArray';
import {BlockCipher} from './lib/BlockCipher';
import {CipherParams} from './lib/CipherParams';
import {Hasher} from './lib/Hasher';
import {SerializableCipher} from './lib/SerializableCipher';
import {PasswordBasedCipher} from './lib/PasswordBasedCipher';
import {AES as AESAlgorithm} from './algo/AES';
import {SHA256 as SHA256Algorithm} from './algo/SHA256';
import {Utf8} from './enc/Utf8';
import {Hex} from './enc/Hex';
import {NoPadding} from './pad/NoPadding';
import {PKCS7} from './pad/PKCS7';
import {CBC} from './mode/CBC';
import {ECB} from './mode/ECB';

// LIB /////////////////////////////////////////////////////////////////////////////////////////////

export const lib = {
  BlockCipher: BlockCipher,
  WordArray: WordArray,
  CipherParams: CipherParams,
  Hasher: Hasher,
  SerializableCipher: SerializableCipher,
  PasswordBasedCipher: PasswordBasedCipher
};

// ALGORITHMS //////////////////////////////////////////////////////////////////////////////////////

export const algo = {
  AES: AESAlgorithm,
  SHA256: SHA256Algorithm
};

// ENCODINGS ///////////////////////////////////////////////////////////////////////////////////////

export const enc = {
  Utf8: Utf8,
  Hex: Hex
};

// PADDING /////////////////////////////////////////////////////////////////////////////////////////

export const pad = {
  NoPadding: NoPadding,
  PKCS7: PKCS7
};

// MODES ///////////////////////////////////////////////////////////////////////////////////////////

export const mode = {
  CBC: CBC,
  ECB: ECB
};

// HELPERS /////////////////////////////////////////////////////////////////////////////////////////

/**
 * ```
 * AES.encrypt(message, key, {iv: iv}).toString()
 * ```
 */
export const AES = lib.BlockCipher._createHelper(algo.AES);
export const SHA256 = lib.Hasher._createHelper(algo.SHA256);

