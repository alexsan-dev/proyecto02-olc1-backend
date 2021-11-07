"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
class ContinueValue extends models_1.default {
    token;
    constructor(token) {
        super(token, 'Continue');
        this.token = token;
    }
    compile(env) {
        let currentEnvironment = env;
        const searchEnvironment = () => {
            if (currentEnvironment?.getName() !== 'Loop') {
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
            const continueFunction = currentEnvironment.getFunction('continue');
            if (continueFunction)
                continueFunction.compile();
            return true;
        }
        else
            return false;
    }
}
exports.default = ContinueValue;
