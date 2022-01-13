export function listKeys(val) {
    if (!val || typeof val !== 'object') {
        return [];
    }

    const keys = Array.isArray(obj)
        ? Object.values(obj).flatMap(listKeys)
        : [...Object.keys(obj), ...Object.values(obj).flatMap(listKeys)];

    return [...new Set(keys)].sort();
}

export function toSortedJson(val) {
    return JSON.stringify(val, listKeys(val));
}

export function toBuffer(val) {
    return new TextEncoder().encode(toSortedJson(val));
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
