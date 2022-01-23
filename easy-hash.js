const { isArray } = Array;
const { entries, fromEntries, values } = Object;

const NODE_HASH_STRING_TO_BROWSER = {
    sha1: 'SHA-1',
    sha256: 'SHA-256',
    sha384: 'SHA-384',
    sha512: 'SHA-512'
};
const BROWSER_HASH_STRING_TO_NODE = {
    'SHA-1': 'sha1',
    'SHA-256': 'sha256',
    'SHA-384': 'sha384',
    'SHA-512': 'sha512'
}

function isString(val) {
    return typeof val === 'string';
}

function isObject(val) {
    return val && typeof val === 'object';
}

function isBuffer(val) {
    return val && val.buffer && val.buffer.constructor === ArrayBuffer;
}

function hasCircularReferences(val, parents = new Set()) {
    if (!isObject(val)) {
        return false;
    }

    if (parents.has(val)) {
        return true;
    }

    let nextParents = new Set([...parents, val]);
    return values(val).some(v => hasCircularReferences(v, nextParents));
}

function toPath(base, key) {
    return base ? `${base}.${key}` : key;
}

function replaceCircularReferences(val, path = '', parents = new Map()) {
    if (!isObject(val)) {
        return val;
    }

    if (parents.has(val)) {
        return `{{Circular(${parents.get(val)})}}`;
    }

    let nextParents = new Map(parents);
    nextParents.set(val, path);

    if (isArray(val)) {
        return val.map((elem, i) => (
            replaceCircularReferences(elem, toPath(path, i), nextParents)
        ));
    }

    return fromEntries(
        entries(val).map(([k, v]) => [
            k,
            replaceCircularReferences(v, toPath(path, k), nextParents)
        ])
    );
}

// Sort function to sort key/value tuples by the key
function keySorter([a], [b]) {
    return a === b ? 0 : a > b ? 1 : -1;
}

// Stringifies the enumerable properties of an object
function getEnumerableString(enumerable) {
    let json = toDeterministicJson({ ...enumerable });
    return json === '{}' ? '' : `<${json}>`;
}

// Custom replacer to:
//   - Sort keys in objects
//   - Stringify normally unstringifiable values (like functions and undefined)
//   - Distinguish between erroneously identical edge cases
//   - Include any enumerable properties on objects like functions
function jsonReplacer(key, val) {
    let valType = typeof val;

    if (val === undefined || valType === 'symbol') {
        return `{{${val}}}`;
    }

    if (valType === 'bigint') {
        return `{{BigInt(${val})}}`;
    }

    if (valType === 'number' && !Number.isFinite(val)) {
        return `{{Number(${val})}}`
    }

    if (valType === 'function') {
        return `{{Function(${val})${getEnumerableString(val)}}}`;
    }

    if (isObject(val) && !isArray(val)) {
        if (val instanceof Date) {
            let asIso = val.toISOString();
            return `{{Date(${asIso})${getEnumerableString(val)}}}`;
        }

        if (val instanceof Map || val instanceof WeakMap) {
            let asObj = toDeterministicJson(fromEntries(val));
            return `{{Map(${asObj})${getEnumerableString(val)}}}`;
        }

        if (val instanceof Set || val instanceof WeakSet) {
            let asArray = toDeterministicJson(Array.from(val));
            return `{{Set(${asArray})${getEnumerableString(val)}}}`;
        }

        return fromEntries(entries(val).sort(keySorter));
    }

    return val;
}

function nodeHash(strOrBuffer, algo = 'sha256') {
    let nodeAlgo = BROWSER_HASH_STRING_TO_NODE[algo] || algo;

    return global.crypto
        .createHash(nodeAlgo)
        .update(strOrBuffer)
        .digest('hex');
}

async function browserHash(strOrBuffer, algo = 'SHA-256') {
    let browserAlgo = NODE_HASH_STRING_TO_BROWSER[algo] || algo;
    let toHash = isString(strOrBuffer)
        ? new TextEncoder().encode(strOrBuffer)
        : strOrBuffer;

    if (!isBuffer(toHash)) {
        throw new TypeError('Value to hash must be string or ArrayBuffer');
    }

    let hash = await window.crypto.subtle.digest(browserAlgo, toHash);

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Hash a string or array buffer using native functionality.
 *
 * @param {string|ArrayBuffer} val - a string or buffer
 * @param {string} [algo] - a valid algorithm name string
 * @returns {string} - the digest formatted as a hexadecimal string
 */
export const basicHash = typeof window === 'undefined'
    ? nodeHash
    : browserHash;

/**
 * Generate valid JSON from any JS value such that equivalent objects produce
 * the same output string, but distinct values produce distinct strings.
 *
 * The generic JSON.stringify function runs into a number of issues creating
 * deterministic strings:
 *   - Object keys are unsorted
 *   - All Maps and Sets stringify to the same empty object
 *   - undefined, symbols, and functions are simply dropped
 *   - Circular references and BigInts cause errors to be thrown
 *
 * This utility handles all of these edge cases, guaranteeing a distinct
 * deterministic output in almost all cases.
 *
 * @param {*} val - any JS value
 * @param {string} [algo] - a valid algorithm name string
 * @returns {string} - the digest formatted as a hexadecimal string
 */
export function toDeterministicJson(val) {
    let toStringify = hasCircularReferences(val)
        ? replaceCircularReferences(val)
        : val;

    return JSON.stringify(toStringify, jsonReplacer);
}

/**
 * Hash any JS value using native functionality.
 *
 * If passed a string or ArrayBuffer, the value is hashed directly.
 * Other JSON stringified using a custom replacer to ensure distinct
 * deterministic hashes.
 *
 * @param {*} val - any JS value
 * @param {string} [algo] - a valid algorithm name string
 * @returns {string} - the digest formatted as a hexadecimal string
 */
export function easyHash(val, algo = 'SHA-256') {
    let toHash = isString(val) || isBuffer(val)
        ? val
        : toDeterministicJson(val);

    return basicHash(toHash, algo);
}

export default easyHash;
