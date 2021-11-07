"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const value_1 = __importDefault(require("../expression/value"));
const models_1 = __importDefault(require("../models"));
class ReturnValue extends models_1.default {
    token;
    props;
    constructor(token, props) {
        super(token, 'Return');
        this.token = token;
        this.props = props;
    }
    compile(env) {
        if (this.props.content.compile(env)) {
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
                const value = this.props.content.getValue(env);
                if (value?.compile(env)) {
                    const newValue = new value_1.default(this.token, {
                        value: value.getValue(env),
                        type: value.getType(),
                        generic: value.props.generic,
                    });
                    currentEnvironment.addVar('return', value.getType(), newValue);
                    const returnFunction = currentEnvironment.getFunction('return');
                    if (returnFunction)
                        returnFunction.compile();
                    return true;
                }
                else
                    return false;
            }
            else
                return false;
        }
        else
            return false;
    }
    getValue(env) {
        return this.props.content.getValue(env);
    }
}
exports.default = ReturnValue;
