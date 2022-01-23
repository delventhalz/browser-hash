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

function isObject(val) {
    return val && typeof val === 'object';
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

function keySorter([a], [b]) {
    return a === b ? 0 : a > b ? 1 : -1;
}

function getEnumerableString(enumerable) {
    let json = toDeterministicJson({ ...enumerable });
    return json === '{}' ? '' : `<${json}>`;
}

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

export function toDeterministicJson(val) {
    let toStringify = hasCircularReferences(val)
        ? replaceCircularReferences(val)
        : val;

    return JSON.stringify(toStringify, jsonReplacer);
}

function nodeHash(str, algo = 'sha256') {
    let nodeAlgo = BROWSER_HASH_STRING_TO_NODE[algo] || algo;
    return global.crypto.createHash(nodeAlgo).update(str).digest('hex');
}

async function browserHash(str, algo = 'SHA-256') {
    let browserAlgo = NODE_HASH_STRING_TO_BROWSER[algo] || algo;
    let buffer = new TextEncoder().encode(str);
    let hash = await window.crypto.subtle.digest(browserAlgo, buffer);

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

export const basicHash = typeof window === 'undefined'
    ? nodeHash
    : browserHash;

export function easyHash(val, algo = 'SHA-256') {
    let toHash = typeof val === 'string' ? val : toDeterministicJson(val);
    return basicHash(toHash, algo);
}

export default easyHash;
