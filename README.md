# browserHash

A lightweight wrapper to make digests from the
[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
a little more pleasant to use. Hash strings, ArrayBuffers, and TypedArrays
directly in the browser with zero dependencies or other overhead.

Note that this library is not intended for cryptographic purposes. If you need
cryptographically secure hashing, there are extra steps you may need to take
which this library will not be suited for.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
    * [browserHash](#browserhash-1)
    * [isBuffer](#isbuffer)
    * [stringToBuffer](#stringtobuffer)
    * [bufferToHex](#buffertohex)
- [Compatibility](#compatibility)
- [Tests](#tests)
- [License](#license)

## Installation

```bash
npm install --save browser-hash
```

## Usage

### browserHash

```javascript
import browserHash from "browser-hash";

let name = "Ishmael";

browserHash(name).then(console.log);
// 1aa0fcc1147088ab255380f60b7d1b6394fd447a33ef5a067c188b79f9b81d94
```

#### `browserHash(strOrBuffer, [algo="SHA-256"])`

_Parameters:_

- **`strOrBuffer`** - The value to hash. Can be a string, an ArrayBuffer, or a
  TypedArray (Uint8Array, Uint16Array, etc). Throws an error when passed any
  other type of value.
- **`algo`** _(optional)_ - The name of the hashing algorithm to use. Supported
  values are:
  * `"SHA-1"`
  * `"SHA-256"` _(default)_
  * `"SHA-384"`
  * `"SHA-512"`

_Returns:_

- A Promise that resolves to the specified hash, formatted as a hexadecimal
  string.

A lightweight wrapper around
[SubtleCrypto.digest](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest),
`browserHash` asynchronously hashes a string or buffer. All resulting digests
are formatted as hexadecimal strings for convenience.

If you wish to use a different algorithm than the default SHA-256, specify the
name of the algorithm as the second parameter.

```javascript
let name = "Ishmael";

browserHash(name, "SHA-1").then(console.log);
// 5cf59925a1926d4907a6bf56f42f0355b34a5812
```

ArrayBuffers and TypedArrays can hashed the same way as strings.

```javascript
let data = Uint8Array.from([80, 101, 113, 117, 111, 100]);

browserHash(data).then(console.log);
// 01c66c73fdc47f95e37e12bdbd637c07d6ce116eb5409d188b6baa4c23ab0e3a
```

### isBuffer

```javascript
import { isBuffer } from "browser-hash";

let name = "Ishmael";
let data = Uint8Array.from([80, 101, 113, 117, 111, 100]);

console.log(isBuffer(name));
// false

console.log(isBuffer(data));
// true

console.log(isBuffer([1, 2, 3]));
// false
```

#### `isBuffer(val)`

_Parameters:_

- **`val`** - The value to check.

_Returns:_

- A boolean. Returns `true` if the value is an ArrayBuffer or TypedArray,
  `false` otherwise.

In addition to the main `browserHash` function, some of the utilities used by
the function are provided as named exports for convenience.

The `isBuffer` utility simply checks if a value is an ArrayBuffer or
TypedArray.

### stringToBuffer

```javascript
import { stringToBuffer } from "browser-hash";

let data = stringToBuffer("Pequod");

console.log(data);
// Uint8Array(6) [80, 101, 113, 117, 111, 100]
```

#### `stringToBuffer(str)`

_Parameters:_

- **`str`** - The string to convert to a Uint8Array. Non-string values will
  have their `toString` method called and then be converted.

_Returns:_

- A UTF-8 encoded Uint8Array.

`stringToBuffer` is a very thin wrapper around
[TextEncoder.encode](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encode).

### bufferToHex

```javascript
import { bufferToHex } from "browser-hash";

let data = Uint8Array.from([80, 101, 113, 117, 111, 100]);

console.log(bufferToHex(data));
// 506571756f64
```

#### `bufferToHex(buffer)`

_Parameters:_

- **`buffer`** - An ArrayBuffer or TypedArray to convert into a hex string.

_Returns:_

- The binary data from the buffer, formatted as a hexadecimal string.

Convert smallish buffers into hex strings for readability and portability.

### bufferHash

```javascript
import { bufferHash } from "browser-hash";

let name = "Ishmael";

bufferHash(name).then(console.log);
// Uint8Array(32) [26, 160, 252, 193, 20, 112, 136, ...]
```

#### `bufferHash(strOrBuffer, [algo="SHA-256"])`

_Parameters:_

- **`strOrBuffer`** - The value to hash. Can be a string, an ArrayBuffer, or a
  TypedArray (Uint8Array, Uint16Array, etc). Throws an error when passed any
  other type of value.
- **`algo`** _(optional)_ - The name of the hashing algorithm to use. Supported
  values are:
  * `"SHA-1"`
  * `"SHA-256"` _(default)_
  * `"SHA-384"`
  * `"SHA-512"`

_Returns:_

- A Promise that resolves to the specified hash, formatted as a Uint8Array.

Similar to `browserHash`, but skips converting the digest to a hex string,
instead returning a Uint8Array directly. Useful if you want to do further
binary operations on the digest.

## Compatibility

Compatible with any browser that supports
[Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest),
[TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encode),
and
[JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
Basically all modern browsers and _not_ Internet Explorer.

## Tests

This repo includes some units tests of the basic functionality in the
[spec/](./spec/) directory. To run the tests, first clone this repo and install
the dev dependencies:

```bash
git clone https://github.com/delventhalz/browser-hash.git
cd browser-hash
npm install
```

Then run the tests:

```bash
npm test
```

## License

[MIT Licensed](./LICENSE)
