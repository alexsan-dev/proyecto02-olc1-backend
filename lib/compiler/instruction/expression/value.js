"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../../utils/types"));
const models_1 = __importDefault(require("../models"));
class Value extends models_1.default {
    props;
    refType;
    constructor(token, props) {
        super(token, 'Value');
        this.props = props;
        this.refType = this.props.type;
    }
    compile(env) {
        if (this.props.type === types_1.default.ID) {
            if (env) {
                const newValue = env.getVar(this.props.value);
                if (newValue?.compile(env)) {
                    this.refType = newValue?.getType();
                    this.props.generic = newValue.props.generic;
                }
            }
        }
        return true;
    }
    getType() {
        return this.refType;
    }
    getValue(env) {
        if (env) {
            if (typeof this.props.value !== 'object') {
                switch (this.props.type) {
                    case types_1.default.STRING:
                        return this.props.value;
                    case types_1.default.INTEGER:
                        if (typeof this.props.value === 'string')
                            return parseInt(this.props.value, 10);
                        else
                            return this.props.value;
                    case types_1.default.DOUBLE:
                        if (typeof this.props.value === 'string')
                            return parseFloat(this.props.value);
                        else
                            return this.props.value;
                    case types_1.default.BOOLEAN:
                        if (typeof this.props.value === 'string')
                            return this.props.value.toLowerCase() === 'true';
                        else
                            return this.props.value;
                    case types_1.default.CHARACTER:
                        return this.props.value.charAt(0);
                    case types_1.default.ID:
                        if (this.props.value) {
                            const newValue = env.getVar(this.props.value);
                            if (newValue?.compile(env)) {
                                this.refType = newValue.getType();
                                return newValue.getValue(env);
                            }
                        }
                        break;
                    default:
                        return this.props.value;
                }
            }
            else
                return this.props.value;
        }
    }
}
exports.default = Value;
