"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const symbols_1 = __importDefault(require("./compiler/symbols"));
const error_1 = __importDefault(require("./compiler/error"));
const logs_1 = __importDefault(require("./compiler/logs"));
const compiler_1 = __importDefault(require("./compiler"));
const grammar_1 = __importDefault(require("./grammar"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.post('/compile', (req, res) => {
    const body = req.body;
    if (body?.code?.length) {
        try {
            symbols_1.default.length = 0;
            error_1.default.length = 0;
            logs_1.default.length = 0;
            const instructions = grammar_1.default.parse(body.code);
            (0, compiler_1.default)(instructions);
            return res.status(200).json({ success: true, symbols: symbols_1.default, errors: error_1.default, logs: logs_1.default });
        }
        catch (err) {
            return res.status(200).json({ success: false, err });
        }
    }
    else
        return res.status(200).json({ success: false });
});
app.listen(5000, () => {
    console.log('Servidor en http://localhost:5000');
});
exports.default = {};
