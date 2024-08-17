// Constants
const BASE64_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";  // RFC 4648, section 5

// Functions
/**
 * Generates a truncated hash of the string.
 * @param {string} string string to generate the truncated hash for
 * @returns truncated hash
 */
function truncated_hash(string) {
    let hash = sha256(string);
    if (hash.length !== 64) {
        throw Error(`Somehow hash of '${string}' does not have 64 characters?`);
    }
    return hash.substring(16);  // Keep only last 48 characters
}

/**
 * Converts a string of hexadecimal digits into bits.
 * @param {string} hexString string of hexadecimal digits, without the leading `0x`
 * @returns an array of bits, padded to the correct length
 */
function hex_to_bin(hexString) {
    if (hexString.length === 0) {
        return [];
    }

    let bitString = parseInt(hexString, 16).toString(2).padStart(hexString.length * 4, "0");
    let bits = [];
    for (let i = 0; i < bitString.length; i++) {
        bits.push(parseInt(bitString[i]));
    }
    return bits;
}

/**
 * Converts an array of bits into a hexadecimal number.
 * @param {int[]} bits array of bits, padded to the correct length
 * @returns string of hexadecimal numbers, without the leading `0x`
 */
function bin_to_hex(bits) {
    if (bits.length === 0) {
        return "";
    }

    if (bits.length % 4 !== 0) {
        throw Error(`Invalid length for bit array: ${bits}`);
    }

    let bitString = ""
    for (let i = 0; i < bits.length; i++) {
        bitString += bits[i];
    }
    let hexString = parseInt(bitString, 2).toString(16).padStart(bits.length / 4, "0");
    return hexString;
}

/**
 * Converts a URL-Safe Base64 string into bits.
 * @param {string} b64String string of URL-Safe Base64 characters
 * @returns array of bits, padded to the correct length
 */
function base64_to_bin(b64String) {
    if (b64String.length === 0) {
        return [];
    }

    let bits = [];
    for (let i = 0; i < b64String.length; i++) {
        let numericVal = BASE64_CHARACTERS.indexOf(b64String[i]);
        let bitString = numericVal.toString(2).padStart(6, "0");  // Base64 uses 6 bits per character
        for (let j = 0; j < 6; j++) {
            bits.push(parseInt(bitString[j]));
        }
    }
    return bits;
}

/**
 * Converts bits back into a URL-Safe Base64 string.
 * @param {int[]} bits array of bits, padded to the correct length
 * @returns a URL-Safe Base64 string
 */
function bin_to_base64(bits) {
    if (bits.length === 0) {
        return ""
    }

    if (bits.length % 6 !== 0) {
        throw Error(`Invalid length for bit array: ${bits}`);
    }

    let bitString = ""
    for (let i = 0; i < bits.length; i++) {
        bitString += bits[i];
    }

    let finalLen = bits.length / 6;  // Base64 uses 6 bits per character
    let b64String = "";
    for (let i = 0; i < finalLen; i++) {
        let numericVal = parseInt(bitString.substring(i * 6, i * 6 + 6), 2);
        b64String += BASE64_CHARACTERS.charAt(numericVal);
    }
    return b64String;
}

/**
 * Performs bitwise XOR.
 * @param {int[]} bits1 first array of bits
 * @param {int[]} bits2 second array of bits
 * @returns array of XORed bits
 */
function bin_xor(bits1, bits2) {
    if (bits1.length !== bits2.length) {
        throw Error(`Both bit arrays must be of the same length (${bits1.length} vs ${bits2.length})`);
    }

    let length = bits1.length;
    let final = [];
    for (let i = 0; i < length; i++) {
        if (bits1[i] == bits2[i]) {
            // If they match, the result is a 0
            final.push(0);
        } else {
            // Otherwise, when they do not match, the result is a 1
            final.push(1);
        }
    }
    return final;
}
