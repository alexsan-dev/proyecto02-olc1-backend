"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("../../runtime/environment"));
const functions_1 = __importDefault(require("../methods/functions"));
const models_1 = __importDefault(require("../models"));
class Switch extends models_1.default {
    props;
    isOnBreak = false;
    constructor(token, props) {
        super(token, 'Switch');
        this.props = props;
    }
    addControlFunction(env, name) {
        env.addFunction(name, 'void', new functions_1.default(this.token, {
            id: name,
            type: 'void',
            content: [
                {
                    token: this.token,
                    name: 'FunctionCall',
                    compile: () => {
                        this.isOnBreak = true;
                        return true;
                    },
                },
            ],
            params: [],
        }));
    }
    compile(env) {
        const localEnv = new environment_1.default('Switch', 'switch', env);
        this.addControlFunction(localEnv, 'break');
        this.addControlFunction(localEnv, 'return');
        let compile = true;
        if (this.props.value.compile(localEnv)) {
            let foundCase = false;
            for (let caseIndex = 0, length = this.props.cases?.length || 0; caseIndex < length; caseIndex++) {
                if (this.props.cases?.length) {
                    if (this.props.cases[caseIndex].case?.compile(localEnv)) {
                        if (this.props.cases[caseIndex].case.getValue(localEnv)?.getValue(localEnv) ===
                            this.props.value.getValue(localEnv)?.getValue(localEnv)) {
                            foundCase = true;
                            const caseEnv = new environment_1.default('Case', `case_${caseIndex}`, localEnv);
                            for (let instructionIndex = 0, instructionsLength = this.props.cases[caseIndex].body.length; instructionIndex < instructionsLength; instructionIndex++) {
                                if (!this.isOnBreak)
                                    compile = this.props.cases[caseIndex].body[instructionIndex].compile(caseEnv);
                                else
                                    break;
                            }
                            if (this.isOnBreak)
                                break;
                        }
                    }
                }
            }
            if (!foundCase) {
                if (this.props.default && this.props.default.body) {
                    const defEnv = new environment_1.default('Case', 'default', localEnv);
                    for (let instructionIndex = 0, instructionsLength = this.props.default.body.length; instructionIndex < instructionsLength; instructionIndex++) {
                        if (!this.isOnBreak)
                            compile = this.props.default.body[instructionIndex].compile(defEnv);
                        else
                            break;
                    }
                }
            }
        }
        else
            compile = false;
        return compile;
    }
}
exports.default = Switch;
