
#include <stdint.h>

struct roundkeys {
    uint8_t key1, key2;
};

// The "flip_value" is used to convert between the LSB supplied tables and the MSB
// examples I found online. If you would like to use LSB everywhere, remove this argument
// and instead subtract 1 when setting the 'target' value in the function.
template <typename T>
T permute(T input, uint8_t *permutation, uint8_t flip_value, uint8_t result_length) {
    T result = 0, temp;
    for (int i = 0; i < result_length; i++) {
        // Shift the current number over
        result = result << 1;
        // Get the required bit for this position, subtract 1 to turn into an index
        uint8_t target = flip_value - permutation[i];
        // Isolate the required bit
        temp = input & (1 << target);
        // Move the bit to the least significant position
        temp = temp >> target;
        // Add it to our result
        result |= temp;
    }
    return result;
}

uint8_t P10[10] = {3, 5, 2, 7, 4, 10, 1, 9, 8, 6};
uint8_t P8[8] = {6, 3, 7, 4, 8, 5, 10, 9};
uint8_t IP[8] = {2, 6, 3, 1, 4, 8, 5, 7};
uint8_t IPinv[8] = {4, 1, 3, 5, 7, 2, 8, 6};
uint8_t S0[16] = {1, 0, 3, 2, 3, 2, 1, 0, 0, 2, 1, 3, 3, 1, 3, 2};
uint8_t S1[16] = {0, 1, 2, 3, 2, 0, 1, 3, 3, 0, 1, 0, 2, 1, 0, 3};
uint8_t EP[8] = {4, 1, 2, 3, 2, 3, 4, 1};
uint8_t P4[4] = {2, 4, 3, 1};

roundkeys generate_round_keys(uint16_t key) {
    roundkeys output;
    uint8_t   left, right;
    // Perform the initial permutation P10
    key = permute<uint16_t>(key, P10, 10, 10);
    // Separate out the left and right parts
    left = (key >> 5) & 0b11111;
    right = key & 0b11111;
    // Rotate left cyclically
    left = ((left << 1) | ((left & 0b10000) >> 4)) & 0b11111;
    right = ((right << 1) | ((right & 0b10000) >> 4)) & 0b11111;
    // Now permute into key 1
    key = ((uint16_t)left << 5) | ((uint16_t)right);
    output.key1 = permute<uint16_t>(key, P8, 10, 8);
    // Now left shift both twice
    left = ((left << 2) | ((left & 0b11000) >> 3)) & 0b11111;
    right = ((right << 2) | ((right & 0b11000) >> 3)) & 0b11111;
    // Create key 2
    key = ((uint16_t)left << 5) | ((uint16_t)right);
    output.key2 = permute<uint16_t>(key, P8, 10, 8);

    return output;
}

uint8_t f_function_lookup(uint8_t inp, uint8_t *table) {
    // Inner 2 bits are a column number, outer 2 are a row number
    int col = (inp >> 1) & 0b11;
    int row = (inp & 1) | ((inp & 0b1000) >> 2);
    return table[col + row * 4];
}

uint8_t f_function(uint8_t data, uint8_t roundkey) {
    uint8_t left, right;
    data = permute<uint8_t>(data, EP, 4, 8);
    data = data ^ roundkey;
    left = data >> 4;
    right = data & 0b1111;
    left = f_function_lookup(left, S0);
    right = f_function_lookup(right, S1);
    return permute<uint8_t>((left << 2) | right, P4, 4, 4);
}

uint8_t _des(uint8_t input, roundkeys &keys) {
    uint8_t left, right;
    // Perform the initial permutation
    input = permute<uint8_t>(input, IP, 8, 8);
    // Split into halves
    left = input >> 4;
    right = input & 0b1111;
    // ----------------------
    // Run the F function on the right half with the first key
    input = right;
    right = f_function(right, keys.key1);
    // XOR the F-function result with the left half.
    right = left ^ right;
    // Swap the halves.
    left = input;
    // ----------------------
    // Repeat the above block with the second key
    input = right;
    right = left ^ f_function(right, keys.key2);
    left = input;
    // Perform the inverse initial permutation
    return permute<uint8_t>(right << 4 | left, IPinv, 8, 8);
}

uint8_t des(uint8_t input, uint16_t key) {
    // Create the round-keys
    roundkeys gen = generate_round_keys(key);
    return _des(input, gen);
}

uint8_t des_decode(uint8_t input, uint16_t key) {
    // Create the round-keys
    roundkeys gen = generate_round_keys(key);
    // Flip the keys to decode
    uint8_t temp = gen.key1;
    gen.key1 = gen.key2;
    gen.key2 = temp;
    return _des(input, gen);
}
