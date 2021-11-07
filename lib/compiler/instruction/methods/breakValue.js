"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
class BreakValue extends models_1.default {
    token;
    constructor(token) {
        super(token, 'Break');
        this.token = token;
    }
    compile(env) {
        let currentEnvironment = env;
        const searchEnvironment = () => {
            if (currentEnvironment?.getName() !== 'Function' &&
                currentEnvironment?.getName() !== 'Loop' &&
                currentEnvironment?.getName() !== 'Switch') {
                if (currentEnvironment?.getPrevEnv()) {
                    currentEnvironment = currentEnvironment?.getPrevEnv();
                    searchEnvironment();
                }
                else
                    return;
            }
            else
                return;
        };
        searchEnvironment();
        if (currentEnvironment) {
            const breakFunction = currentEnvironment.getFunction('break');
            if (breakFunction)
                breakFunction.compile();
            return true;
        }
        else
            return false;
    }
}
exports.default = BreakValue;
