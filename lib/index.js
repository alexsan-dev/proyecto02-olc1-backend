"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ast_1 = __importStar(require("./compiler/ast"));
const symbols_1 = __importDefault(require("./compiler/symbols"));
const error_1 = __importDefault(require("./compiler/error"));
const logs_1 = __importDefault(require("./compiler/logs"));
const compiler_1 = __importDefault(require("./compiler"));
const grammar_1 = __importDefault(require("./grammar"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
let instructions = [];
(0, ast_1.default)();
app.get('/dot', (_req, res) => {
    res.status(200).json({ dot: (0, ast_1.generateDot)(instructions) });
});
app.post('/compile', (req, res) => {
    const body = req.body;
    if (body?.code?.length) {
        try {
            symbols_1.default.length = 0;
            error_1.default.length = 0;
            logs_1.default.length = 0;
            instructions = grammar_1.default.parse(body.code);
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
