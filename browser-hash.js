const { entries, fromEntries } = Object;

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
    return val && typeof val === 'object' && !Array.isArray(val);
}

function keySorter([a], [b]) {
    return a === b ? 0 : a > b ? 1 : -1;
}

function jsonReplacer(key, val) {
    if (isNotJsonStringable(val)) {
        return `{{${val}}}`;
    }

    if (isObject(val)) {
        if (val instanceof Date) {
            let asIso = val.toISOString();
            return `{{${asIso}}}`;
        }

        if (val instanceof Map || val instanceof WeakMap) {
            let asObj = toDeterministicJson(fromEntries(val));
            return `{{${asObj}}}`;
        }

        if (val instanceof Set || val instanceof WeakSet) {
            let asArray = toDeterministicJson(Array.from(val));
            return `{{${asArray}}}`;
        }

        return fromEntries(entries(val).sort(keySorter));
    }

    return val;
}

export function toDeterministicJson(val) {
    return JSON.stringify(val, jsonReplacer);
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
