import { Platform } from 'react-native';

const noop = () => {};

let _getHash: () => Promise<string[]> = () => Promise.resolve([]);
let _useOtpVerify: (opts: { numberOfDigits: number }) => { otp: string | null } = () => ({ otp: null });
let _removeListener: () => void = noop;

if (Platform.OS === 'android') {
  const mod = require('react-native-otp-verify');
  _getHash        = mod.getHash;
  _useOtpVerify   = mod.useOtpVerify;
  _removeListener = mod.removeListener;
}

export const getHash        = _getHash;
export const useOtpVerify   = _useOtpVerify;
export const removeListener = _removeListener;
