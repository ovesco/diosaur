"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Registrer_1 = __importDefault(require("./Metadata/Registrer"));
const Factory_1 = require("./Factory");
const Decorators_1 = require("./Decorators");
exports.Service = Decorators_1.Service;
exports.Inject = Decorators_1.Inject;
exports.InjectAll = Decorators_1.InjectAll;
exports.Factory = Decorators_1.Factory;
exports.Parameter = Decorators_1.Parameter;
exports.getContainer = () => __awaiter(this, void 0, void 0, function* () {
    return yield Registrer_1.default.build();
});
exports.refreshContainer = () => __awaiter(this, void 0, void 0, function* () {
    return yield Registrer_1.default.build(true);
});
exports.setParameter = (key, value) => {
    Registrer_1.default.setParameter(key, value);
};
exports.register = (identifier, factory, config = {}) => {
    const maker = typeof factory === 'function' ? factory : () => factory;
    const fnFactory = new Factory_1.FunctionFactory(maker);
    Registrer_1.default.registerFactory(fnFactory, Symbol(identifier.toString()), Object.assign({}, Decorators_1.defaultConfig(identifier), config));
};
exports.registerAsync = (identifier, factory, config = {}) => {
    const maker = typeof factory === 'function' ? factory : () => factory;
    const finalConfig = Object.assign({}, Decorators_1.defaultConfig(identifier), config);
    const fnFactory = new Factory_1.FunctionFactory(maker);
    if (finalConfig.scoping !== Decorators_1.SCOPES.singleton) {
        throw new Error('Dynamically registered async factories must be registered as singletons');
    }
    Registrer_1.default.registerFactory(fnFactory, Symbol(identifier.toString()), finalConfig);
};
