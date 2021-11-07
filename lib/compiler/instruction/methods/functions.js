"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const environment_1 = __importDefault(require("../../runtime/environment"));
const models_1 = __importDefault(require("../models"));
const error_1 = __importDefault(require("../../error"));
class FunctionBlock extends models_1.default {
    token;
    props;
    env;
    functionValue;
    isOnBreak = false;
    constructor(token, props) {
        super(token, 'Function');
        this.token = token;
        this.props = props;
        this.env = {};
        this.functionValue = undefined;
    }
    getValue() {
        return this.functionValue;
    }
    setEnv(env) {
        this.env = new environment_1.default('Function', this.props.id, env);
        this.isOnBreak = false;
        this.functionValue = undefined;
        this.env.addFunction('return', 'void', new FunctionBlock(this.token, {
            id: 'return',
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
    compile() {
        const compiles = [];
        for (let instructionIndex = 0, length = this.props.content.length; instructionIndex < length; instructionIndex++) {
            if (this.env) {
                if (!this.isOnBreak)
                    compiles.push(this.props.content[instructionIndex].compile(this.env));
                else
                    break;
            }
        }
        if (this.env && 'getVar' in this.env)
            this.functionValue = this.env?.getVar('return');
        if (this.props.type !== 'void') {
            if (this.props.type === this.functionValue?.getType() ||
                this.props.type === `${utils_1.DataType.DYNAMICLIST}<${this.functionValue?.props.generic}>`) {
                if (this.props.type === utils_1.DataType.ARRAY) {
                    if (this.props.generic !== this.functionValue?.props.generic)
                        return false;
                }
                return compiles.every((result) => result === true);
            }
            else {
                error_1.default.push({
                    type: 'Semantic',
                    token: this.token,
                    msg: `La funcion retorna un ${this.functionValue?.getType()} pero se esperaba un ${this.props.type}`,
                });
                return false;
            }
        }
        else
            return true;
    }
    getEnv() {
        return this.env;
    }
}
exports.default = FunctionBlock;
