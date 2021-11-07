"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
class Main extends models_1.default {
    token;
    functionCall;
    constructor(token, functionCall) {
        super(token, 'Main');
        this.token = token;
        this.functionCall = functionCall;
    }
    compile(env) {
        this.functionCall.compile(env);
        return true;
    }
}
exports.default = Main;
