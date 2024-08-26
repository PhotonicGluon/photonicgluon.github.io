// Constants
const BASE16_CHARACTERS = "0123456789abcdef";
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

    let bits = [];
    for (let i = 0; i < hexString.length; i++) {
        let numericVal = BASE16_CHARACTERS.indexOf(hexString[i]);
        let bitString = numericVal.toString(2).padStart(4, "0");  // Hex uses 4 bits per character
        for (let j = 0; j < 4; j++) {
            bits.push(parseInt(bitString[j]));
        }
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

    let finalLen = bits.length / 4;  // Base64 uses 4 bits per character
    let hexString = "";
    for (let i = 0; i < finalLen; i++) {
        let numericVal = parseInt(bitString.substring(i * 4, i * 4 + 4), 2);
        hexString += BASE16_CHARACTERS.charAt(numericVal);
    }
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
function xor_bin(bits1, bits2) {
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

/**
 * Performs XOR on two hexadecimal strings.
 * @param {string} hex1 first array of hexadecimal digits
 * @param {string} hex2 second array of hexadecimal digits
 * @returns string of hexadecimal digits, representing the XOR result
 */
function xor_hex(hex1, hex2) {
    return bin_to_hex(xor_bin(hex_to_bin(hex1), hex_to_bin(hex2)));
}

/**
 * Converts a string of hexadecimal digits into a drive ID
 * @param {string} hexString
 * @returns Drive ID
 */
function hex_to_drive_id(hexString) {
    // Convert to URL-Safe Base64
    let b64String = bin_to_base64(hex_to_bin(hexString));

    // Drive IDs always starts with a 1
    return "1" + b64String;
}

/**
 * Converts a drive ID into hexadecimal digits
 * @param {string} driveID
 * @returns hexadecimal digits
 */
function drive_id_to_hex(driveID) {
    // Strip leading 1
    let b64String = driveID.substring(1);

    // Convert to hex
    return bin_to_hex(base64_to_bin(b64String));
}

/**
 * Converts a password into a representative hexadecimal value
 * @param {string} password
 * @returns hexadecimal value of the password
 */
function password_to_hex(password) {
    return truncated_hash(password);
}

/**
 * Computes the offset needed.
 * @param {string} password 
 * @param {string} driveID 
 * @returns hexadecimal offset value
 */
function compute_offset(password, driveID) {
    let computedCheck = sha256(driveID).substring(56);
    console.log(computedCheck);
    return xor_hex(password_to_hex(password), drive_id_to_hex(driveID));
}

/**
 * Computes the drive ID for the corresponding password and offset
 * @param {string} password 
 * @param {string} offset offset needed to adjust to the correct drive ID
 * @returns Drive ID
 */
function compute_drive_id(password, offset) {
    return hex_to_drive_id(xor_hex(password_to_hex(password), offset));
}
