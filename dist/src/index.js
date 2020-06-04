var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Registrer from "./Metadata/Registrer";
import { FunctionFactory } from "./Factory";
import { Service, Inject, InjectAll, Factory, Parameter, defaultConfig, SCOPES, } from './Decorators';
export { Service, Inject, InjectAll, Factory, Parameter, };
export const getContainer = () => __awaiter(this, void 0, void 0, function* () {
    return yield Registrer.build();
});
export const refreshContainer = () => __awaiter(this, void 0, void 0, function* () {
    return yield Registrer.build(true);
});
export const setParameter = (key, value) => {
    Registrer.setParameter(key, value);
};
export const register = (identifier, factory, config = {}) => {
    const maker = typeof factory === 'function' ? factory : () => factory;
    const fnFactory = new FunctionFactory(maker);
    Registrer.registerFactory(fnFactory, Symbol(identifier.toString()), Object.assign({}, defaultConfig(identifier), config));
};
export const registerAsync = (identifier, factory, config = {}) => {
    const maker = typeof factory === 'function' ? factory : () => factory;
    const finalConfig = Object.assign({}, defaultConfig(identifier), config);
    const fnFactory = new FunctionFactory(maker);
    if (finalConfig.scoping !== SCOPES.singleton) {
        throw new Error('Dynamically registered async factories must be registered as singletons');
    }
    Registrer.registerFactory(fnFactory, Symbol(identifier.toString()), finalConfig);
};
