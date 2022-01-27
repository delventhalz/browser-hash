// The TypedArray class is not exposed globally
export type TypedArray = Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array;

export type BrowserBuffer = ArrayBuffer | TypedArray;

export function isBuffer(val: unknown): val is BrowserBuffer;
export function stringToBuffer(str: string): Uint8Array;
export function bufferToHex(buffer: BrowserBuffer): string;
export function bufferHash(strOrBuffer: string|BrowserBuffer, algo?: string): Uint8Array;
export function browserHash(strOrBuffer: string|BrowserBuffer, algo?: string): string;
