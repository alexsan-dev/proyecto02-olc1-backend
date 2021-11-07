"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../../utils/types"));
const expression_1 = require("../expression");
class DynamicListValue extends expression_1.Value {
    props;
    constructor(token, props) {
        super(token, {
            value: [],
            type: types_1.default.DYNAMICLIST,
            generic: props.type,
        });
        this.props = props;
        this.props.generic = props.type;
    }
    compile(_env) {
        return true;
    }
    getValue() {
        return [];
    }
}
exports.default = DynamicListValue;
