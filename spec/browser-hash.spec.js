/* global describe it expect */

import browserHash, {
    isBuffer,
    stringToBuffer,
    bufferToHex,
    bufferHash
} from "../browser-hash.js";


// Add functions to global scope for manual testing
window.browserHash = browserHash;
window.isBuffer = isBuffer;
window.stringToBuffer = stringToBuffer;
window.bufferToHex = bufferToHex;
window.bufferHash = bufferHash;


// All constant values generated in Node to test cross-compatibility
const ISHMAEL_UTF_8 = Uint8Array.from([73, 115, 104, 109, 97, 101, 108]);
const PEQUOD_UTF_8 = Uint8Array.from([80, 101, 113, 117, 111, 100]);
const EMPTY_UTF_8 = Uint8Array.from([]);

const ISHMAEL_UTF_8_HEX = "4973686d61656c";
const PEQUOD_UTF_8_HEX = "506571756f64";

const ISHMAEL_SHA_256 = "1aa0fcc1147088ab255380f60b7d1b6394fd447a33ef5a067c188b79f9b81d94";
const PEQUOD_SHA_256 = "01c66c73fdc47f95e37e12bdbd637c07d6ce116eb5409d188b6baa4c23ab0e3a";
const EMPTY_SHA_256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const ISHMAEL_SHA_1 = "5cf59925a1926d4907a6bf56f42f0355b34a5812";
const PEQUOD_SHA_1 = "ea0e21a524d542f9bf1d0eccfbcf66657b949aaf";
const EMPTY_SHA_1 = "da39a3ee5e6b4b0d3255bfef95601890afd80709";

const ISHMAEL_SHA_384 = "3d3b80670e87851bbd736a13907a9eb0a45653b394dc02be57bf82daeb69facf7ff680c084fdeb74e87069d1b7ec94dd";
const PEQUOD_SHA_384 = "a6667805adda8df625f1822b54c722b14b3c351c7fba98893d8afad0388be3e7544d1c0e6a91a9211f1f488272094721";
const EMPTY_SHA_384 = "38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b";

const ISHMAEL_SHA_512 = "f92b4aeb5b6b830bed40bc10e077ae0726adf1d35518b202cb4b069367b0c39b121033786b12c7830068d8b773763267dcdf4ff214d3901d2e5424bf7a3c2f0f";
const PEQUOD_SHA_512 = "58b30c7b31e2bb76eab7f92cf8f09e7a3dbabbd2b22bd2806793fca53d75314977ca8727a17536872f9e942c75a57550f13cc5625af82e85cc090dd76b48c953";
const EMPTY_SHA_512 = "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e";

const ISHMAEL_SHA_256_BUFFER = Uint8Array.from([26, 160, 252, 193, 20, 112, 136, 171, 37, 83, 128, 246, 11, 125, 27, 99, 148, 253, 68, 122, 51, 239, 90, 6, 124, 24, 139, 121, 249, 184, 29, 148]);
const PEQUOD_SHA_256_BUFFER = Uint8Array.from([1, 198, 108, 115, 253, 196, 127, 149, 227, 126, 18, 189, 189, 99, 124, 7, 214, 206, 17, 110, 181, 64, 157, 24, 139, 107, 170, 76, 35, 171, 14, 58]);
const EMPTY_SHA_256_BUFFER = Uint8Array.from([227, 176, 196, 66, 152, 252, 28, 20, 154, 251, 244, 200, 153, 111, 185, 36, 39, 174, 65, 228, 100, 155, 147, 76, 164, 149, 153, 27, 120, 82, 184, 85]);

const ISHMAEL_SHA_1_BUFFER = Uint8Array.from([92, 245, 153, 37, 161, 146, 109, 73, 7, 166, 191, 86, 244, 47, 3, 85, 179, 74, 88, 18]);
const PEQUOD_SHA_1_BUFFER = Uint8Array.from([234, 14, 33, 165, 36, 213, 66, 249, 191, 29, 14, 204, 251, 207, 102, 101, 123, 148, 154, 175]);
const EMPTY_SHA_1_BUFFER = Uint8Array.from([218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9]);

const ISHMAEL_SHA_384_BUFFER = Uint8Array.from([61, 59, 128, 103, 14, 135, 133, 27, 189, 115, 106, 19, 144, 122, 158, 176, 164, 86, 83, 179, 148, 220, 2, 190, 87, 191, 130, 218, 235, 105, 250, 207, 127, 246, 128, 192, 132, 253, 235, 116, 232, 112, 105, 209, 183, 236, 148, 221]);
const PEQUOD_SHA_384_BUFFER = Uint8Array.from([166, 102, 120, 5, 173, 218, 141, 246, 37, 241, 130, 43, 84, 199, 34, 177, 75, 60, 53, 28, 127, 186, 152, 137, 61, 138, 250, 208, 56, 139, 227, 231, 84, 77, 28, 14, 106, 145, 169, 33, 31, 31, 72, 130, 114, 9, 71, 33]);
const EMPTY_SHA_384_BUFFER = Uint8Array.from([56, 176, 96, 167, 81, 172, 150, 56, 76, 217, 50, 126, 177, 177, 227, 106, 33, 253, 183, 17, 20, 190, 7, 67, 76, 12, 199, 191, 99, 246, 225, 218, 39, 78, 222, 191, 231, 111, 101, 251, 213, 26, 210, 241, 72, 152, 185, 91]);

const ISHMAEL_SHA_512_BUFFER = Uint8Array.from([249, 43, 74, 235, 91, 107, 131, 11, 237, 64, 188, 16, 224, 119, 174, 7, 38, 173, 241, 211, 85, 24, 178, 2, 203, 75, 6, 147, 103, 176, 195, 155, 18, 16, 51, 120, 107, 18, 199, 131, 0, 104, 216, 183, 115, 118, 50, 103, 220, 223, 79, 242, 20, 211, 144, 29, 46, 84, 36, 191, 122, 60, 47, 15]);
const PEQUOD_SHA_512_BUFFER = Uint8Array.from([88, 179, 12, 123, 49, 226, 187, 118, 234, 183, 249, 44, 248, 240, 158, 122, 61, 186, 187, 210, 178, 43, 210, 128, 103, 147, 252, 165, 61, 117, 49, 73, 119, 202, 135, 39, 161, 117, 54, 135, 47, 158, 148, 44, 117, 165, 117, 80, 241, 60, 197, 98, 90, 248, 46, 133, 204, 9, 13, 215, 107, 72, 201, 83]);
const EMPTY_SHA_512_BUFFER = Uint8Array.from([207, 131, 225, 53, 126, 239, 184, 189, 241, 84, 40, 80, 214, 109, 128, 7, 214, 32, 228, 5, 11, 87, 21, 220, 131, 244, 169, 33, 211, 108, 233, 206, 71, 208, 209, 60, 93, 133, 242, 176, 255, 131, 24, 210, 135, 126, 236, 47, 99, 185, 49, 189, 71, 65, 122, 129, 165, 56, 50, 122, 249, 39, 218, 62]);

async function expectThrowAsync(fn, errorType) {
    const [error, result] = await fn()
        .then(res => [null, res])
        .catch(err => [err, null]);

    if (error) {
        expect(() => { throw error; }).to.throw(errorType);
    } else {
        expect(() => result).to.throw(errorType);
    }
}

describe("browserHash", () => {
    it("creates SHA-256 digests of strings", async () => {
        expect(await browserHash("Ishmael")).to.equal(ISHMAEL_SHA_256);
        expect(await browserHash("Pequod")).to.equal(PEQUOD_SHA_256);
        expect(await browserHash("")).to.equal(EMPTY_SHA_256);
    });

    it("creates SHA-256 digests of buffers", async () => {
        expect(await browserHash(ISHMAEL_UTF_8)).to.equal(ISHMAEL_SHA_256);
        expect(await browserHash(PEQUOD_UTF_8)).to.equal(PEQUOD_SHA_256);
        expect(await browserHash(EMPTY_UTF_8)).to.equal(EMPTY_SHA_256);
    });

    it("creates SHA-1 digests of strings", async () => {
        expect(await browserHash("Ishmael", "SHA-1")).to.equal(ISHMAEL_SHA_1);
        expect(await browserHash("Pequod", "SHA-1")).to.equal(PEQUOD_SHA_1);
        expect(await browserHash("", "SHA-1")).to.equal(EMPTY_SHA_1);
    });

    it("creates SHA-1 digests of buffers", async () => {
        expect(await browserHash(ISHMAEL_UTF_8, "SHA-1")).to.equal(ISHMAEL_SHA_1);
        expect(await browserHash(PEQUOD_UTF_8, "SHA-1")).to.equal(PEQUOD_SHA_1);
        expect(await browserHash(EMPTY_UTF_8, "SHA-1")).to.equal(EMPTY_SHA_1);
    });

    it("creates SHA-384 digests of strings", async () => {
        expect(await browserHash("Ishmael", "SHA-384")).to.equal(ISHMAEL_SHA_384);
        expect(await browserHash("Pequod", "SHA-384")).to.equal(PEQUOD_SHA_384);
        expect(await browserHash("", "SHA-384")).to.equal(EMPTY_SHA_384);
    });

    it("creates SHA-384 digests of buffers", async () => {
        expect(await browserHash(ISHMAEL_UTF_8, "SHA-384")).to.equal(ISHMAEL_SHA_384);
        expect(await browserHash(PEQUOD_UTF_8, "SHA-384")).to.equal(PEQUOD_SHA_384);
        expect(await browserHash(EMPTY_UTF_8, "SHA-384")).to.equal(EMPTY_SHA_384);
    });

    it("creates SHA-512 digests of strings", async () => {
        expect(await browserHash("Ishmael", "SHA-512")).to.equal(ISHMAEL_SHA_512);
        expect(await browserHash("Pequod", "SHA-512")).to.equal(PEQUOD_SHA_512);
        expect(await browserHash("", "SHA-512")).to.equal(EMPTY_SHA_512);
    });

    it("creates SHA-512 digests of buffers", async () => {
        expect(await browserHash(ISHMAEL_UTF_8, "SHA-512")).to.equal(ISHMAEL_SHA_512);
        expect(await browserHash(PEQUOD_UTF_8, "SHA-512")).to.equal(PEQUOD_SHA_512);
        expect(await browserHash(EMPTY_UTF_8, "SHA-512")).to.equal(EMPTY_SHA_512);
    });

    it("throws a TypeError when passed a non-string non-buffer", async () => {
        await expectThrowAsync(() => browserHash(true), TypeError);
        await expectThrowAsync(() => browserHash(7), TypeError);
        await expectThrowAsync(() => browserHash([1, 2, 3]), TypeError);
        await expectThrowAsync(() => browserHash({ name: "Ishmael" }), TypeError);
    });

    describe("isBuffer", () => {
        it("passes ArrayBuffers and ArrayBufferViews", () => {
            expect(isBuffer(ISHMAEL_UTF_8)).to.be.true;
            expect(isBuffer(new ArrayBuffer(16))).to.be.true;
            expect(isBuffer(new DataView(PEQUOD_UTF_8.buffer))).to.be.true;
        });

        it("fails all other value types", () => {
            expect(isBuffer(true)).to.be.false;
            expect(isBuffer(0)).to.be.false;
            expect(isBuffer("Ishmael")).to.be.false;
            expect(isBuffer([73, 115, 104, 109, 97, 101, 108])).to.be.false;
            expect(isBuffer({ name: "Ishamel" })).to.be.false;
        });
    });

    describe("stringToBuffer", () => {
        it("converts strings to UTF-8 encoded Uint8Arrays", () => {
            expect(stringToBuffer("Ishmael")).to.be.instanceOf(Uint8Array);
            expect(stringToBuffer("Ishmael")).to.deep.equal(ISHMAEL_UTF_8);
            expect(stringToBuffer("Pequod")).to.deep.equal(PEQUOD_UTF_8);
            expect(stringToBuffer("")).to.deep.equal(EMPTY_UTF_8);
        });
    });

    describe("bufferToHex", () => {
        it("converts Uint8Arrays to hex strings", () => {
            expect(bufferToHex(ISHMAEL_UTF_8)).to.equal(ISHMAEL_UTF_8_HEX);
            expect(bufferToHex(PEQUOD_UTF_8)).to.equal(PEQUOD_UTF_8_HEX);
            expect(bufferToHex(EMPTY_UTF_8)).to.equal("");
        });

        it("converts other ArrayBuffers and ArrayBufferViews to hex strings", () => {
            expect(bufferToHex(new ArrayBuffer(0))).to.equal("");
            expect(bufferToHex(Uint16Array.from(ISHMAEL_UTF_8))).to.equal(ISHMAEL_UTF_8_HEX);
            expect(bufferToHex(new DataView(PEQUOD_UTF_8.buffer))).to.equal(PEQUOD_UTF_8_HEX);
        });
    });

    describe("bufferHash", () => {
        it("creates SHA-256 digests of strings", async () => {
            expect(await bufferHash("Ishmael")).to.deep.equal(ISHMAEL_SHA_256_BUFFER);
            expect(await bufferHash("Pequod")).to.deep.equal(PEQUOD_SHA_256_BUFFER);
            expect(await bufferHash("")).to.deep.equal(EMPTY_SHA_256_BUFFER);
        });

        it("creates SHA-256 digests of buffers", async () => {
            expect(await bufferHash(ISHMAEL_UTF_8)).to.deep.equal(ISHMAEL_SHA_256_BUFFER);
            expect(await bufferHash(PEQUOD_UTF_8)).to.deep.equal(PEQUOD_SHA_256_BUFFER);
            expect(await bufferHash(EMPTY_UTF_8)).to.deep.equal(EMPTY_SHA_256_BUFFER);
        });

        it("creates SHA-1 digests of strings", async () => {
            expect(await bufferHash("Ishmael", "SHA-1")).to.deep.equal(ISHMAEL_SHA_1_BUFFER);
            expect(await bufferHash("Pequod", "SHA-1")).to.deep.equal(PEQUOD_SHA_1_BUFFER);
            expect(await bufferHash("", "SHA-1")).to.deep.equal(EMPTY_SHA_1_BUFFER);
        });

        it("creates SHA-1 digests of buffers", async () => {
            expect(await bufferHash(ISHMAEL_UTF_8, "SHA-1")).to.deep.equal(ISHMAEL_SHA_1_BUFFER);
            expect(await bufferHash(PEQUOD_UTF_8, "SHA-1")).to.deep.equal(PEQUOD_SHA_1_BUFFER);
            expect(await bufferHash(EMPTY_UTF_8, "SHA-1")).to.deep.equal(EMPTY_SHA_1_BUFFER);
        });

        it("creates SHA-384 digests of strings", async () => {
            expect(await bufferHash("Ishmael", "SHA-384")).to.deep.equal(ISHMAEL_SHA_384_BUFFER);
            expect(await bufferHash("Pequod", "SHA-384")).to.deep.equal(PEQUOD_SHA_384_BUFFER);
            expect(await bufferHash("", "SHA-384")).to.deep.equal(EMPTY_SHA_384_BUFFER);
        });

        it("creates SHA-384 digests of buffers", async () => {
            expect(await bufferHash(ISHMAEL_UTF_8, "SHA-384")).to.deep.equal(ISHMAEL_SHA_384_BUFFER);
            expect(await bufferHash(PEQUOD_UTF_8, "SHA-384")).to.deep.equal(PEQUOD_SHA_384_BUFFER);
            expect(await bufferHash(EMPTY_UTF_8, "SHA-384")).to.deep.equal(EMPTY_SHA_384_BUFFER);
        });

        it("creates SHA-512 digests of strings", async () => {
            expect(await bufferHash("Ishmael", "SHA-512")).to.deep.equal(ISHMAEL_SHA_512_BUFFER);
            expect(await bufferHash("Pequod", "SHA-512")).to.deep.equal(PEQUOD_SHA_512_BUFFER);
            expect(await bufferHash("", "SHA-512")).to.deep.equal(EMPTY_SHA_512_BUFFER);
        });

        it("creates SHA-512 digests of buffers", async () => {
            expect(await bufferHash(ISHMAEL_UTF_8, "SHA-512")).to.deep.equal(ISHMAEL_SHA_512_BUFFER);
            expect(await bufferHash(PEQUOD_UTF_8, "SHA-512")).to.deep.equal(PEQUOD_SHA_512_BUFFER);
            expect(await bufferHash(EMPTY_UTF_8, "SHA-512")).to.deep.equal(EMPTY_SHA_512_BUFFER);
        });

        it("throws a TypeError when passed a non-string non-buffer", async () => {
            await expectThrowAsync(() => bufferHash(true), TypeError);
            await expectThrowAsync(() => bufferHash(7), TypeError);
            await expectThrowAsync(() => bufferHash([1, 2, 3]), TypeError);
            await expectThrowAsync(() => bufferHash({ name: "Ishmael" }), TypeError);
        });
    });
});
