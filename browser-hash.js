const { isArray } = Array;
const { entries, fromEntries, values } = Object;

function isNotJsonStringable(val) {
    return (
        val === undefined
            || typeof val === 'function'
            || (typeof val === 'number' && !Number.isFinite(val))
            || typeof val === 'bigint'
            || typeof val === 'symbol'
    );
}

function isObject(val) {
    return val && typeof val === 'object';
}

function isDictionaryLike(val) {
    return isObject(val) && !isArray(val);
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
    if (typeof val === 'function') {
        return `{{Function(${val})${getEnumerableString(val)}}}`;
    }

    if (isNotJsonStringable(val)) {
        return `{{${val}}}`;
    }

    if (isDictionaryLike(val)) {
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

export function toBuffer(val) {
    return new TextEncoder().encode(toDeterministicJson(val));
}

export function bufferToHex(buff) {
    return Array.from(new Uint8Array(buff))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

export async function browserHash(val, algo = 'SHA-1') {
    const hash = await window.crypto.subtle.digest(algo, toBuffer(val));
    return bufferToHex(hash);
}

export default browserHash;
