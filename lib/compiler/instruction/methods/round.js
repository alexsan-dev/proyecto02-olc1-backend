"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../../utils/types"));
const call_1 = __importDefault(require("./call"));
const error_1 = __importDefault(require("../../error"));
class Round extends call_1.default {
    refValue;
    constructor(token, props) {
        super(token, { ...props, id: 'Round' }, true);
        this.props.id = 'Round';
    }
    compile(env) {
        if (this.props.params[0] && this.props.params[0].compile(env)) {
            if (this.props.params[0].getValue(env)?.getType() === types_1.default.DOUBLE ||
                this.props.params[0].getValue(env)?.getType() === types_1.default.INTEGER) {
                this.refValue =
                    Math.round((this.props.params[0].getValue(env)?.getValue(env) || 0)) || 0;
                return true;
            }
            else {
                error_1.default.push({
                    token: this.token,
                    type: 'Semantic',
                    msg: `La funcion espera un ${types_1.default.DOUBLE} | ${types_1.default.INTEGER} como parametro.`,
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
        return types_1.default.INTEGER;
    }
}
exports.default = Round;
