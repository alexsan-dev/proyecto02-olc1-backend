"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../../utils/types"));
const __1 = require("..");
const error_1 = __importDefault(require("../../error"));
class ToString extends __1.FunctionCall {
    refValue;
    constructor(token, props) {
        super(token, { ...props, id: 'ToString' }, true);
    }
    compile(env) {
        if (this.props.params[0] && this.props.params[0].compile(env)) {
            if (this.props.params[0].getValue(env)?.getType() === types_1.default.INTEGER ||
                this.props.params[0].getValue(env)?.getType() === types_1.default.DOUBLE ||
                this.props.params[0].getValue(env)?.getType() === types_1.default.BOOLEAN) {
                this.refValue = this.props.params[0].getValue(env)?.getValue(env)?.toString();
                return true;
            }
            else {
                error_1.default.push({
                    token: this.token,
                    type: 'Semantic',
                    msg: `La funcion espera un ${types_1.default.INTEGER} | ${types_1.default.DOUBLE} | ${types_1.default.BOOLEAN} como parametro.`,
                });
                return false;
            }
        }
        else
            return false;
    }
    getValue() {
        return this.refValue;
    }
    getType() {
        return types_1.default.STRING;
    }
}
exports.default = ToString;
