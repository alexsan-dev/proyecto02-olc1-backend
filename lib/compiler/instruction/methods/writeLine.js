"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const call_1 = __importDefault(require("./call"));
const logs_1 = __importDefault(require("../../logs"));
class WriteLine extends call_1.default {
    token;
    props;
    constructor(token, props) {
        super(token, { ...props, id: 'WriteLine' }, true);
        this.token = token;
        this.props = props;
        this.props.id = 'WriteLine';
    }
    compile(env) {
        this.props.params.forEach((exp) => {
            if (exp.compile(env)) {
                if (exp.getValue(env)?.compile(env)) {
                    logs_1.default.push(exp.getValue(env)?.getValue(env));
                    console.log(exp.getValue(env)?.getValue(env));
                }
            }
        });
        return true;
    }
}
exports.default = WriteLine;
