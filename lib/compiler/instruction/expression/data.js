"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = __importDefault(require("./tools"));
const models_1 = __importDefault(require("../models"));
class Expression extends models_1.default {
    props;
    childToken;
    constructor(token, props) {
        super(token, 'Expression');
        this.props = props;
        this.childToken = token;
    }
    compile(_env) {
        return true;
    }
    getValue(env) {
        const left = this.props.left?.getValue(env);
        const right = this.props.right?.getValue(env);
        const condition = this.props.condition?.getValue(env);
        if (left) {
            if (this.props.operator) {
                const result = (0, tools_1.default)(env, this.childToken, left, this.props.operator, right, condition);
                if (result)
                    return result;
            }
            else {
                if (left.compile(env))
                    return left;
            }
        }
        else if (this.props.value) {
            if (this.props.value.compile(env))
                return this.props.value;
        }
    }
}
exports.default = Expression;
