# easyHash

Hash anything using native JavaScript functionality with zero dependencies.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
    * [easyHash](#easyhash-1)
    * [easyHashSync](#easyhashsync)
    * [basicHash](#basichash)
    * [basicHashSync](#basichashsync)
    * [toDeterministicJson](#todeterministicjson)
- [Compatibility](#compatibility)
- [License](#license)

## Installation

```bash
npm install easy-hash
```

## Usage

### easyHash

```javascript
import easyHash from 'easy-hash';

let user = {
    id: 1337,
    name: 'Sue'
};

easyHash(user).then(console.log);
// 64901768d9e8af909944d11afcaf6a11d30da003077a8db9e69185ba9728aadd
```

**`easyHash(val[, algo])`**

_Parameters:_

- **`val`** - Any JavaScript value, including strings, buffers, and objects.
- **`algo`** _(optional)_ - A valid algorithm string name. On the browser,
  `"sha1"`, `"sha256"`, `"sha384"`, `"sha512"`, `"SHA-1"`, `"SHA-256"`,
  `"SHA-384"`, and `"SHA-512"` are valid. In Node, a variety of algorithms are
  supported. They can be listed using openssl in the command line with:
  `openssl list -digest-algorithms`. Defaults to `"SHA-256"`.

_Returns:_

- A Promise that resolves to the specified hash formatted as a hexadecimal
  string.

The default hashing function, it accepts any value and asynchronously produces
a hexadecimal digest. Works identically on both Node and in the browser.

For objects, keys are sorted before hashing, so equivalent objects produce
identical hashes:

```javascript
easyHash({ id: 1337, name: 'Sue'}).then(console.log);
// 64901768d9e8af909944d11afcaf6a11d30da003077a8db9e69185ba9728aadd

easyHash({ name: 'Sue', id: 1337 }).then(console.log);
// 64901768d9e8af909944d11afcaf6a11d30da003077a8db9e69185ba9728aadd
```

Strings and buffers are hashed as-is, and will produce equivalent results to
other hash implementations:

```javascript
import { createHash } from 'crypto';

let nodeHash = createHash('sha1').update('Sue').digest('hex');
console.log(nodeHash);
// fa0307dae8fa8d8e2a3e031d6e2f092c2bc94c40

easyHash('Sue', 'SHA-1').then(console.log);
//fa0307dae8fa8d8e2a3e031d6e2f092c2bc94c40
```

Circular references, functions, and other values that are typically difficult
to stringify all produce distinct hash values:

```javascript
let circle = {};
circle.ref = circle;
easyHash(circle).then(console.log);
// eb0e4589f1767b761b297b69595de2e0dc4cc0deb75271865017bfdde2892737

let add = (x, y) => x + y;
easyHash(add).then(console.log);
//148524b1b9b7601f9e48670c3bda5c27ad0eeb11e9234b921ca79fe156d8917a

let multiply = (x, y) => x * y;
easyHash(multiply).then(console.log);
// 9d2be08dbb7336288b7c3aa55d7dc94a3aa9e3128298cc63340ac455e7b13956
```

### easyHashSync

```javascript
import { easyHashSync } from 'easy-hash';

let user = {
    id: 1337,
    name: 'Sue'
};

let hash = easyHashSync(user);
console.log(hash);
// 64901768d9e8af909944d11afcaf6a11d30da003077a8db9e69185ba9728aadd
```

**`easyHashSync(val[, algo])`**

_Parameters:_

- **`val`** - Any JavaScript value, including strings, buffers, and objects.
- **`algo`** _(optional)_ - A valid algorithm string name.

_Returns:_

- The specified hash formatted as a hexadecimal string.

Performs identical operations to `easyHash`, but synchronously. _Only usable in
the Node environment. Browsers **must** use the asynchronous `easyHash`._

### basicHash

```javascript
import { basicHash } from 'easy-hash';

let buffer = new Uint8Array([83, 117, 101]);
basicHash(buffer, 'SHA-1').then(console.log);
// fa0307dae8fa8d8e2a3e031d6e2f092c2bc94c40

basicHash('Sue', 'SHA-1').then(console.log);
// fa0307dae8fa8d8e2a3e031d6e2f092c2bc94c40
```

**`basicHash(strOrBuffer[, algo])`**

_Parameters:_

- **`strOrBuffer`** - A string or ArrayBuffer to hash directly.
- **`algo`** _(optional)_ - A valid algorithm string name.

_Returns:_

- A Promise that resolves to the specified hash formatted as a hexadecimal
  string.

Similar to `easyHash` but skips any stringifying. Only usable on strings and
buffers. Note that `easyHash` _automatically_ skips stringifying both string
and buffer values. The only reason to use this alternative is if you would like
an error to be thrown when non-string, non-buffer values are passed in.

### basicHashSync

```javascript
import { basicHashSync } from 'easy-hash';

let user = {
    id: 1337,
    name: 'Sue'
};

let hash = basicHashSync(user);
console.log(hash);
// 64901768d9e8af909944d11afcaf6a11d30da003077a8db9e69185ba9728aadd
```

**`basicHashSync(strOrBuffer[, algo])`**

_Parameters:_

- **`strOrBuffer`** - A string or ArrayBuffer to hash directly.
- **`algo`** _(optional)_ - A valid algorithm string name.

_Returns:_

- The specified hash formatted as a hexadecimal string.

A synchronous version of `basicHash`. Not usable on the browser.

### toDeterministicJson

```javascript
import { toDeterministicJson } from 'easy-hash';

let user = {
    name: 'Sue',
    role: undefined,
    circle: {}
};
user.circle.ref = user.circle;

let json = toDeterministicJson(user);
console.log(json);
// {"circle":{"ref":"{{Circular(circle)}}"},"name":"Sue","role":"{{undefined}}"}
```

**`toDeterministicJson(val)`**

_Parameters:_

- **`val`** - Any JavaScript value, including circular references, functions,
  and other values not typically stringifiable with JSON.

_Returns:_

- A valid JSON string with sorted keys and special "double-curly" string
  values to represent values not typically stringifiable with JSON.

A modified version of `JSON.stringify`, designed to work with nearly any value,
producing identical strings for equivalent values and different strings for
distinct values.

It sorts the keys of stringified objects:

```javascript
console.log(toDeterministicJson({ name: 'Sue', id: 1337 }));
// {"id":1337,"name":"Sue"}

console.log(toDeterministicJson({ id: 1337, name: 'Sue' }));
// {"id":1337,"name":"Sue"}
```

It uses double-curly strings for unrepresentable values:

```javascript
let json = toDeterministicJson({ identity: undefined, level: 9000n });
console.log(json);
// {"identity":"{{undefined}}","level":"{{BigInt(9000)}}"}
```

It converts Maps, Sets, and functions into distinct double-curly strings:

```javascript
let names = new Set(['Sue', 'Susan', 'Suzy']);
let json = toDeterministicJson({ names });
console.log(json);
// {"names":"{{Set([\"Sue\",\"Susan\",\"Suzy\"])}}"}
```

## Compatibility

Compatible with any browser that supports the
[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest),
and
[JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
Basically all modern browsers but _not_ Internet Explorer.

Compatible with Node back to version 14.

## License

[MIT Licensed](./LICENSE)
