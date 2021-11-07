"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../../utils/types"));
const call_1 = __importDefault(require("./call"));
const error_1 = __importDefault(require("../../error"));
class ToCharArray extends call_1.default {
    props;
    refValue;
    constructor(token, props) {
        super(token, { ...props, id: 'ToCharArray' }, true);
        this.props = props;
        this.props.id = 'ToCharArray';
    }
    compile(env) {
        if (this.props.params[0] && this.props.params[0].compile(env)) {
            if (this.props.params[0].getValue(env)?.getType() === types_1.default.STRING) {
                this.refValue = (this.props.params[0].getValue(env)?.getValue(env)?.toString() || '').split('');
                this.props.generic = types_1.default.CHARACTER;
                return true;
            }
            else {
                error_1.default.push({
                    token: this.token,
                    type: 'Semantic',
                    msg: `La funcion espera un ${types_1.default.STRING} como parametro.`,
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
        return types_1.default.DYNAMICLIST;
    }
}
exports.default = ToCharArray;
