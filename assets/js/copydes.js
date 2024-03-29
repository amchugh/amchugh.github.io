
const clip = `uint16_t key = 0b1000001100;
uint8_t outputs[256] = {0x9d, 0xd2, 0x56, 0x83, 0xf8, 0x97, 0x13, 0xc6, 0xb3, 0xca, 0xf0, 0xed, 0xf6, 0x8b, 0x55, 0x68, 0x8c, 0xaa, 0x35, 0xe4, 0x9, 0xeb, 0x90, 0x65, 0xb6, 0x91, 0xfb, 0x4b, 0xf3, 0x34, 0x9e, 0xa, 0xf5, 0x7a, 0xfe, 0x2b, 0x50, 0x1f, 0x9b, 0x6a, 0x3b, 0x66, 0x58, 0x5, 0x5e, 0x23, 0x3d, 0x84, 0x60, 0x6, 0x5d, 0x8, 0xe1, 0x43, 0x38, 0x8d, 0x1e, 0xf9, 0x73, 0xe3, 0x7b, 0x9c, 0x36, 0xa6, 0x49, 0x46, 0xc2, 0x17, 0xcc, 0x3, 0x87, 0x52, 0x27, 0x5a, 0x80, 0x39, 0x62, 0x3f, 0x1, 0x5c, 0xb8, 0x3a, 0x61, 0x94, 0xdd, 0x5f, 0xe0, 0x31, 0x22, 0xc5, 0x4f, 0xff, 0x67, 0x44, 0xe, 0x9a, 0xa1, 0xea, 0x6e, 0x9f, 0x20, 0xab, 0x2f, 0xfa, 0x8f, 0xf2, 0x6c, 0x51, 0xce, 0xb7, 0xe9, 0xf4, 0x10, 0x92, 0x89, 0x3c, 0xb5, 0xd7, 0xc, 0x59, 0x8e, 0x2d, 0xe7, 0x77, 0xcf, 0xa8, 0xa2, 0x32, 0x1b, 0x54, 0xd0, 0x25, 0x7e, 0xf1, 0x75, 0xa4, 0xd5, 0xe8, 0x76, 0xb, 0x70, 0x6d, 0x33, 0x4a, 0xae, 0x88, 0x53, 0x86, 0xef, 0xd, 0x16, 0xc3, 0x30, 0xf7, 0x7d, 0xad, 0x95, 0xb2, 0x18, 0x28, 0x93, 0xfc, 0x78, 0xcd, 0xd6, 0x99, 0x1d, 0x48, 0xbd, 0x4, 0xde, 0xa3, 0xd8, 0x85, 0xbb, 0xe6, 0x2, 0x64, 0xdb, 0x2a, 0x47, 0xe5, 0xbe, 0x6b, 0x98, 0x7f, 0x15, 0x45, 0xfd, 0x1a, 0xb0, 0xc4, 0xaf, 0x24, 0xa0, 0x71, 0xee, 0xa5, 0x21, 0xd4, 0x81, 0xdc, 0xe2, 0xbf, 0x0, 0xb9, 0xa7, 0xda, 0x3e, 0xbc, 0xc7, 0x12, 0x5b, 0xd9, 0x82, 0x57, 0x40, 0x63, 0xa9, 0x79, 0xc1, 0x26, 0x2c, 0x1c, 0x7, 0xc8, 0x4c, 0x19, 0x42, 0x4d, 0xc9, 0x7c, 0x69, 0x74, 0x4e, 0x37, 0xec, 0xd1, 0xf, 0x72, 0x96, 0x14, 0x6f, 0xba, 0xd3, 0xb1, 0x2e, 0xdf, 0xac, 0xcb, 0x41, 0x11, 0x29, 0x8a, 0xc0, 0xb4};
`;

$(function () {
    $("#copy").click(function () {
        navigator.clipboard.writeText(clip);
        alert("Text copied to clipboard.");
    });
});