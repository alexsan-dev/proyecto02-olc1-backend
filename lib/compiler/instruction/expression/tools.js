"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultValues = void 0;
const types_1 = __importStar(require("../../utils/types"));
const error_1 = __importDefault(require("../../error"));
const value_1 = __importDefault(require("./value"));
const operateValues = (env, token, left, operator, right, condition) => {
    const lValue = left.compile(env) ? left.getValue(env) : undefined;
    const lType = left.getType();
    const rValue = right?.compile(env) ? right?.getValue(env) : undefined;
    const rType = right?.getType();
    const conditionValue = condition?.getValue(env);
    let value;
    let type;
    switch (operator) {
        case types_1.Operator.PLUS:
            switch (lType) {
                case types_1.default.INTEGER:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = lValue + rValue;
                            type = types_1.default.INTEGER;
                            break;
                        case types_1.default.DOUBLE:
                            value = lValue + rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.BOOLEAN:
                            value = lValue + (rValue ? 1 : 0);
                            type = types_1.default.INTEGER;
                            break;
                        case types_1.default.CHARACTER:
                            value = lValue + rValue.charCodeAt(0);
                            type = types_1.default.INTEGER;
                            break;
                        case types_1.default.STRING:
                            value = lValue + rValue;
                            type = types_1.default.STRING;
                            break;
                        default:
                            break;
                    }
                    break;
                case types_1.default.DOUBLE:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = lValue + rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.DOUBLE:
                            value = lValue + rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.BOOLEAN:
                            value = lValue + (rValue ? 1 : 0);
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.CHARACTER:
                            value = lValue + rValue.charCodeAt(0);
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.STRING:
                            value = lValue + rValue;
                            type = types_1.default.STRING;
                            break;
                        default:
                            break;
                    }
                    break;
                case types_1.default.BOOLEAN:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = (rValue ? 1 : 0) + rValue;
                            type = types_1.default.INTEGER;
                            break;
                        case types_1.default.DOUBLE:
                            value = (rValue ? 1 : 0) + rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.STRING:
                            value = lValue ? 'true' : 'false' + rValue;
                            type = types_1.default.STRING;
                            break;
                        default:
                            break;
                    }
                    break;
                case types_1.default.CHARACTER:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = lValue.charCodeAt(0) + rValue;
                            type = types_1.default.INTEGER;
                            break;
                        case types_1.default.DOUBLE:
                            value = lValue.charCodeAt(0) + rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.STRING:
                            value = lValue + rValue;
                            type = types_1.default.STRING;
                            break;
                        default:
                            break;
                    }
                    break;
                case types_1.default.STRING:
                    value = lValue + rValue;
                    type = types_1.default.STRING;
                    break;
                default:
                    break;
            }
            break;
        case types_1.Operator.MINUS:
            switch (lType) {
                case types_1.default.INTEGER:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = lValue - rValue;
                            type = types_1.default.INTEGER;
                            break;
                        case types_1.default.DOUBLE:
                            value = lValue - rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.BOOLEAN:
                            value = lValue - (rValue ? 1 : 0);
                            type = types_1.default.INTEGER;
                            break;
                        case types_1.default.CHARACTER:
                            value = lValue - rValue.charCodeAt(0);
                            type = types_1.default.INTEGER;
                            break;
                        default:
                            break;
                    }
                    break;
                case types_1.default.DOUBLE:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = lValue - rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.DOUBLE:
                            value = lValue - rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.BOOLEAN:
                            value = lValue - (rValue ? 1 : 0);
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.CHARACTER:
                            value = lValue - rValue.charCodeAt(0);
                            type = types_1.default.DOUBLE;
                            break;
                        default:
                            break;
                    }
                    break;
                case types_1.default.BOOLEAN:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = (rValue ? 1 : 0) - rValue;
                            type = types_1.default.INTEGER;
                            break;
                        case types_1.default.DOUBLE:
                            value = (rValue ? 1 : 0) - rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        default:
                            break;
                    }
                    break;
                case types_1.default.CHARACTER:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = lValue.charCodeAt(0) - rValue;
                            type = types_1.default.INTEGER;
                            break;
                        case types_1.default.DOUBLE:
                            value = lValue.charCodeAt(0) - rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            break;
        case types_1.Operator.TIMES:
            switch (lType) {
                case types_1.default.INTEGER:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = lValue * rValue;
                            type = types_1.default.INTEGER;
                            break;
                        case types_1.default.DOUBLE:
                            value = lValue * rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.CHARACTER:
                            value = lValue * rValue.charCodeAt(0);
                            type = types_1.default.INTEGER;
                            break;
                        default:
                            break;
                    }
                    break;
                case types_1.default.DOUBLE:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = lValue * rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.DOUBLE:
                            value = lValue * rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.CHARACTER:
                            value = lValue * rValue.charCodeAt(0);
                            type = types_1.default.DOUBLE;
                            break;
                        default:
                            break;
                    }
                    break;
                case types_1.default.CHARACTER:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = lValue.charCodeAt(0) * rValue;
                            type = types_1.default.INTEGER;
                            break;
                        case types_1.default.DOUBLE:
                            value = lValue.charCodeAt(0) * rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            break;
        case types_1.Operator.DIVISION:
            if (rValue !== 0)
                switch (lType) {
                    case types_1.default.INTEGER:
                        switch (rType) {
                            case types_1.default.INTEGER:
                                value = lValue / rValue;
                                type = types_1.default.DOUBLE;
                                break;
                            case types_1.default.DOUBLE:
                                value = lValue / rValue;
                                type = types_1.default.DOUBLE;
                                break;
                            case types_1.default.CHARACTER:
                                value = lValue / rValue.charCodeAt(0);
                                type = types_1.default.DOUBLE;
                                break;
                            default:
                                break;
                        }
                        break;
                    case types_1.default.DOUBLE:
                        switch (rType) {
                            case types_1.default.INTEGER:
                                value = lValue / rValue;
                                type = types_1.default.DOUBLE;
                                break;
                            case types_1.default.DOUBLE:
                                value = lValue / rValue;
                                type = types_1.default.DOUBLE;
                                break;
                            case types_1.default.CHARACTER:
                                value = lValue / rValue.charCodeAt(0);
                                type = types_1.default.DOUBLE;
                                break;
                            default:
                                break;
                        }
                        break;
                    case types_1.default.CHARACTER:
                        switch (rType) {
                            case types_1.default.INTEGER:
                                value = lValue.charCodeAt(0) / rValue;
                                type = types_1.default.INTEGER;
                                break;
                            case types_1.default.DOUBLE:
                                value = lValue.charCodeAt(0) / rValue;
                                type = types_1.default.DOUBLE;
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
            break;
        case types_1.Operator.POWER:
            switch (lType) {
                case types_1.default.INTEGER:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = Math.pow(lValue, rValue);
                            type = types_1.default.INTEGER;
                            break;
                        case types_1.default.DOUBLE:
                            value = Math.pow(lValue, rValue);
                            type = types_1.default.DOUBLE;
                            break;
                        default:
                            break;
                    }
                    break;
                case types_1.default.DOUBLE:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = Math.pow(lValue, rValue);
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.DOUBLE:
                            value = Math.pow(lValue, rValue);
                            type = types_1.default.DOUBLE;
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            break;
        case types_1.Operator.MODULE:
            switch (lType) {
                case types_1.default.INTEGER:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = lValue % rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.DOUBLE:
                            value = lValue % rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        default:
                            break;
                    }
                    break;
                case types_1.default.DOUBLE:
                    switch (rType) {
                        case types_1.default.INTEGER:
                            value = lValue % rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        case types_1.default.DOUBLE:
                            value = lValue % rValue;
                            type = types_1.default.DOUBLE;
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            break;
        case types_1.Operator.NEGATION:
            switch (lType) {
                case types_1.default.INTEGER:
                    value = lValue * -1;
                    type = types_1.default.INTEGER;
                    break;
                case types_1.default.DOUBLE:
                    value = lValue * -1;
                    type = types_1.default.DOUBLE;
                    break;
                default:
                    break;
            }
            break;
        case types_1.Operator.OR:
            value = lValue || rValue;
            type = types_1.default.BOOLEAN;
            break;
        case types_1.Operator.AND:
            value = lValue || rValue;
            type = types_1.default.BOOLEAN;
            break;
        case types_1.Operator.TERNARY:
            if (conditionValue && conditionValue !== undefined) {
                value = lValue;
                type = lType;
            }
            else {
                value = rValue;
                type = rType;
            }
            break;
        case types_1.Operator.EQUALSEQUALS:
            value = lValue === rValue;
            type = types_1.default.BOOLEAN;
            break;
        case types_1.Operator.NONEQUALS:
            value = lValue !== rValue;
            type = types_1.default.BOOLEAN;
            break;
        case types_1.Operator.MOREOREQUALS:
            value = lValue >= rValue;
            type = types_1.default.BOOLEAN;
            break;
        case types_1.Operator.LESSOREQUALS:
            value = lValue <= rValue;
            type = types_1.default.BOOLEAN;
            break;
        case types_1.Operator.MAJOR:
            value = lValue > rValue;
            type = types_1.default.BOOLEAN;
            break;
        case types_1.Operator.MINOR:
            value = lValue < rValue;
            type = types_1.default.BOOLEAN;
            break;
        default:
            break;
    }
    if (value !== undefined && type !== undefined)
        return new value_1.default(token, { value: value.toString(), type });
    else
        error_1.default.push({
            type: 'Semantic',
            msg: `No es posible operar la expresion ${lType} ${operator} ${rType}.`,
            token,
        });
};
const defaultValues = (type) => {
    switch (type) {
        case types_1.default.INTEGER:
            return 0;
        case types_1.default.DOUBLE:
            return 0;
        case types_1.default.STRING:
            return '';
        case types_1.default.BOOLEAN:
            return true;
        case types_1.default.CHARACTER:
            return '0';
        case types_1.default.ARRAY:
            return [];
        default:
            return '';
    }
};
exports.defaultValues = defaultValues;
exports.default = operateValues;
