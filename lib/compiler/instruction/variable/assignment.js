"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../../utils/types"));
const models_1 = __importDefault(require("../models"));
const error_1 = __importDefault(require("../../error"));
class Assignment extends models_1.default {
    id;
    constructor(token, id) {
        super(token, 'Assignment');
        this.id = id;
    }
    setValue(env, type, value, isNew = true) {
        if (this.id?.length) {
            if (value?.compile(env)) {
                const typeException = (type === types_1.default.DOUBLE && value.getType() === types_1.default.INTEGER) ||
                    (type === types_1.default.INTEGER && value.getType() === types_1.default.DOUBLE) ||
                    type === `${types_1.default.DYNAMICLIST}<${value.props.generic}>`;
                if (type === value.getType() || typeException) {
                    if (isNew)
                        env.addVar(this.id, type, value);
                    else
                        env.setVar(this.id, value);
                    return true;
                }
                else {
                    if (type) {
                        error_1.default.push({
                            type: 'Semantic',
                            token: this.token,
                            msg: `No se puede asignar el tipo ${value.getType()} a ${type}.`,
                        });
                    }
                    else
                        error_1.default.push({
                            type: 'Semantic',
                            token: this.token,
                            msg: `Es posible que la variable ${this.id} no este declarada.`,
                        });
                    return false;
                }
            }
            else
                return false;
        }
        else
            return false;
    }
    compile(_env, _type) {
        return true;
    }
}
exports.default = Assignment;
