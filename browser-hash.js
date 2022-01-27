/**
 * Determine if a value is a valid ArrayBuffer or ArrayBufferView,
 * including Uint8Array, Uint16Array, etc.
 *
 * @param {*} val - the value to check
 * @returns {boolean}
 */
export function isBuffer(val) {
    return (
        Boolean(val && val.buffer) && val.buffer.constructor === ArrayBuffer
    );
}

/**
 * Convert a string into a UTF-8 encoded Uint8Array.
 *
 * @param {string} str - the string to convert
 * @returns {Uint8Array}
 */
export function stringToBuffer(str) {
    return new TextEncoder().encode(str);
}

/**
 * Convert an ArrayBuffer or ArrayBufferView into a hexadecimal string.
 *
 * @param {ArrayBuffer} buffer - the ArrayBuffer to convert
 * @returns {string} - a hex string
 */
export function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

/**
 * Hash a string or array buffer using native functionality.
 *
 * @param {string|ArrayBuffer} val - a string or buffer
 * @param {string} [algo] - a valid algorithm name string
 * @returns {Promise<string>} - the digest formatted as a hexadecimal string
 */
export async function browserHash(strOrBuffer, algo = "SHA-256") {
    let toHash = typeof strOrBuffer === "string"
        ? stringToBuffer(strOrBuffer)
        : strOrBuffer;

    if (!isBuffer(toHash)) {
        throw new TypeError(`Cannot hash value of type: ${typeof toHash}`);
    }

    let hash = await window.crypto.subtle.digest(algo, toHash);
    return bufferToHex(hash);
}

export default browserHash;
