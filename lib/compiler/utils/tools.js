"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getToken = (jisonToken) => ({
    line: jisonToken.first_line,
    col: jisonToken.first_column + 1,
});
exports.default = getToken;
