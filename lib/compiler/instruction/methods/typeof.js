"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../../utils/types"));
const __1 = require("..");
class TypeOf extends __1.FunctionCall {
    refValue;
    constructor(token, props) {
        super(token, { ...props, id: 'TypeOf' }, true);
    }
    compile(env) {
        if (this.props.params[0] && this.props.params[0].compile(env)) {
            const newValue = this.props.params[0].getValue(env);
            const valueType = newValue?.getType();
            if (valueType) {
                this.refValue =
                    valueType === types_1.default.DYNAMICLIST
                        ? `${types_1.default.DYNAMICLIST}<${newValue?.props.generic}>`
                        : typeof newValue?.getValue(env) === 'object'
                            ? `${types_1.default.ARRAY}<${newValue?.props.generic}>`
                            : valueType;
            }
            return true;
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
exports.default = TypeOf;
