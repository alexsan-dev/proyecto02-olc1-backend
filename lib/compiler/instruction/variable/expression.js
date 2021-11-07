"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("../expression");
const assignment_1 = __importDefault(require("./assignment"));
const tools_1 = require("../expression/tools");
class ExpAssignment extends assignment_1.default {
    props;
    constructor(token, props) {
        super(token, props.id);
        this.props = props;
    }
    compile(env, type) {
        const nextValue = this.getValue(env, type);
        const value = env.getVar(this.props.id);
        value?.compile(env);
        return super.setValue(env, value?.getType() ?? type, nextValue, type !== undefined);
    }
    getValue(env, type) {
        if (this.props.exp) {
            if (this.props.exp?.compile(env)) {
                const value = this.props.exp.getValue(env);
                if (value)
                    return new expression_1.Value(this.token, {
                        value: value?.getValue(env),
                        type: value?.getType(),
                        generic: value?.props.generic,
                    });
            }
        }
        else
            return new expression_1.Value(this.token, { value: (0, tools_1.defaultValues)(type), type });
    }
}
exports.default = ExpAssignment;
