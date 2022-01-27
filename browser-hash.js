/**
 * Determine if a value is a valid ArrayBuffer or TypedArray.
 *
 * @param {*} val - the value to check
 * @returns {boolean}
 */
export function isBuffer(val) {
    const buffer = val && val.buffer ? val.buffer : val;

    return (
        Boolean(buffer)
            && buffer.constructor === ArrayBuffer
            && !(val instanceof DataView)
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
 * Convert an ArrayBuffer or TypedArray into a hexadecimal string.
 *
 * @param {ArrayBuffer} buffer - the ArrayBuffer to convert
 * @returns {string} - a hex string
 */
export function bufferToHex(buffer) {
    if (!isBuffer(buffer)) {
        throw new TypeError(`Cannot convert value of type: ${typeof buffer}`);
    }

    return Array.from(new Uint8Array(buffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

function convertAndHash(strOrBuffer, algo) {
    let toHash = typeof strOrBuffer === "string"
        ? stringToBuffer(strOrBuffer)
        : strOrBuffer;

    if (!isBuffer(toHash)) {
        throw new TypeError(`Cannot hash value of type: ${typeof toHash}`);
    }

    return window.crypto.subtle.digest(algo, toHash);
}

/**
 * Asynchronously hash a string or array buffer using native functionality,
 * returning the digest formatted as a Uint8Array.
 *
 * @param {string|ArrayBuffer} val - a string or buffer
 * @param {string} [algo] - a valid algorithm name string
 * @returns {Promise<Uint8Array>} - the digest formatted as a Uint8Array
 */
export async function bufferHash(strOrBuffer, algo = "SHA-256") {
    let digest = await convertAndHash(strOrBuffer, algo);
    return new Uint8Array(digest);
}

/**
 * Asynchronously hash a string or array buffer using native functionality,
 * returning the digest formatted as a hexadecimal string.
 *
 * @param {string|ArrayBuffer} val - a string or buffer
 * @param {string} [algo] - a valid algorithm name string
 * @returns {Promise<string>} - the digest formatted as a hexadecimal string
 */
export async function browserHash(strOrBuffer, algo = "SHA-256") {
    let digest = await convertAndHash(strOrBuffer, algo);
    return bufferToHex(digest);
}

export default browserHash;
