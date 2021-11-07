"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("../../runtime/environment"));
const functions_1 = __importDefault(require("../methods/functions"));
const models_1 = __importDefault(require("../models/"));
class CycleControl extends models_1.default {
    props;
    isOnContinue = false;
    handleBreak = false;
    isOnBreak = false;
    constructor(token, props) {
        super(token, 'Loop');
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
                        if (name === 'continue')
                            this.isOnContinue = true;
                        else
                            this.isOnBreak = true;
                        return true;
                    },
                },
            ],
            params: [],
        }));
    }
    compile(env) {
        const containerEnv = new environment_1.default('Loop', 'while-container', env);
        this.addControlFunction(containerEnv, 'continue');
        this.addControlFunction(containerEnv, 'return');
        this.addControlFunction(containerEnv, 'break');
        const runInstructions = (id) => {
            const localEnv = new environment_1.default('Loop', id, containerEnv);
            for (let instructionCount = 0, length = this.props.body.length; instructionCount < length; instructionCount++) {
                const instruction = this.props.body[instructionCount];
                if (!this.isOnBreak && !this.isOnContinue)
                    this.handleBreak = !instruction.compile(localEnv);
                else {
                    if (this.isOnContinue)
                        this.isOnContinue = false;
                    break;
                }
            }
        };
        if (!this.props.isDoLoop)
            while (this.props.condition.compile(containerEnv) &&
                this.props.condition.getValue(containerEnv)?.compile(containerEnv) &&
                this.props.condition.getValue(containerEnv)?.getValue(containerEnv) &&
                !this.handleBreak &&
                !this.isOnBreak)
                runInstructions('while-content');
        else
            do
                runInstructions('do while-content');
            while (this.props.condition.compile(env) &&
                this.props.condition.getValue(env)?.compile(env) &&
                this.props.condition.getValue(env)?.getValue(env) &&
                !this.handleBreak &&
                !this.isOnBreak);
        return true;
    }
}
exports.default = CycleControl;
