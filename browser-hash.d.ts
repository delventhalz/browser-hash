export function isBuffer(val: unknown): val is ArrayBuffer;
export function stringToBuffer(str: string): Uint8Array;
export function bufferToHex(buffer: ArrayBuffer): string;
export function browserHash(val: string|ArrayBuffer, algo?: string): string;
