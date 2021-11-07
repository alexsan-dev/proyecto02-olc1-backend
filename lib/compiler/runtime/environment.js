"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __importDefault(require("../error"));
class Environment {
    name;
    id;
    prevEnv;
    vars;
    functions;
    constructor(name, id, prevEnv) {
        this.name = name;
        this.id = id;
        this.prevEnv = prevEnv;
        this.vars = {};
        this.functions = {};
    }
    getPrevEnv() {
        return this.prevEnv;
    }
    getName() {
        return this.name;
    }
    getID() {
        return this.id;
    }
    addVar(id, type, value) {
        if (this.vars[id] === undefined) {
            this.vars[id] = { value, type };
        }
        else
            error_1.default.push({
                type: 'Semantic',
                token: this.getVar(id)?.token || {},
                msg: `La variable ${id} ya se ha declarado anteriormente.`,
            });
    }
    setVar(id, newValue) {
        if (this.getVar(id) !== undefined) {
            if (this.vars[id] !== undefined)
                this.vars[id] = { value: newValue, type: this.vars[id].type };
            else
                this.prevEnv?.setVar(id, newValue);
        }
        else
            error_1.default.push({
                type: 'Semantic',
                token: this.getVar(id)?.token || {},
                msg: `La variable ${id} no existe.`,
            });
    }
    getVar(id) {
        if (id in this.vars) {
            return this.vars[id].value;
        }
        else {
            if (this.prevEnv)
                return this.prevEnv.getVar(id);
            else
                return undefined;
        }
    }
    getFunction(id) {
        if (id in this.functions) {
            if (this.functions[id]?.value)
                return Object.create(Object.getPrototypeOf(this.functions[id]?.value), Object.getOwnPropertyDescriptors(this.functions[id]?.value));
        }
        else {
            if (this.prevEnv)
                return this.prevEnv.getFunction(id);
            else
                return undefined;
        }
    }
    addFunction(id, type, value) {
        if (this.functions[id] === undefined) {
            this.functions[id] = { value, type };
        }
        else
            error_1.default.push({
                type: 'Semantic',
                token: this.getVar(id)?.token || {},
                msg: `La funcion ${id} ya se ha declarado anteriormente.`,
            });
    }
}
exports.default = Environment;
