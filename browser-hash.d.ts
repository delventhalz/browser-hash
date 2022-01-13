export enum BrowserHashString {
  'SHA-1',
  'SHA-256',
  'SHA-384',
  'SHA-512'
}
export function toDeterministicJson(val: unknown): string;
export function toBytes(val: unknown): Uint8Array;
export function bufferToHex(buff: ArrayBuffer): string;
export function browserHash(val: unknown, algo?: BrowserHashString): string;
