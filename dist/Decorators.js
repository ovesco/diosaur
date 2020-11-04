"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parameter = exports.InjectAll = exports.Inject = exports.defaultInjectConfig = exports.Factory = exports.Service = exports.defaultConfig = exports.SCOPES = void 0;
const Registrer_1 = __importDefault(require("./Metadata/Registrer"));
const Errors_1 = require("./Errors");
;
exports.SCOPES = {
    singleton: 'singleton',
    newable: 'renewable',
    custom: 'custom',
};
exports.defaultConfig = (identifier) => ({
    identifier,
    tag: null,
    scoping: exports.SCOPES.singleton,
    customScopes: []
});
exports.Service = (config = {}) => {
    return (target) => {
        Registrer_1.default.registerService(target, Object.assign(Object.assign({}, exports.defaultConfig(target)), config));
    };
};
/** Factory */
exports.Factory = (createdService, config = {}) => {
    return (factoryConstructor) => {
        const factory = new factoryConstructor();
        if (!('resolve' in factory)) {
            throw new Errors_1.IncorrectFactoryError(factoryConstructor);
        }
        // @ts-ignore
        const isPromise = Reflect.getMetadata('design:returntype', factory, 'resolve') === Promise;
        if (config.scoping && config.scoping !== exports.SCOPES.singleton && isPromise) {
            throw new Error('Async factories MUST be scoped as singletons');
        }
        Registrer_1.default.registerFactory(factory, createdService, Object.assign(Object.assign({}, exports.defaultConfig(createdService)), config));
    };
};
exports.defaultInjectConfig = (identifier) => ({
    identifier,
    tag: null,
    refresh: false,
});
exports.Inject = (config = {}) => {
    return (target, key, index) => {
        if (typeof index === 'number') {
            if (key !== undefined) {
                throw new Errors_1.NotInConstructorError();
            }
            // @ts-ignore
            const constructorParamTypes = Reflect.getMetadata('design:paramtypes', target, key);
            const finalConfig = Object.assign(Object.assign({}, exports.defaultInjectConfig(constructorParamTypes[index])), config);
            Registrer_1.default.registerConstructorInject(target, index, finalConfig);
        }
        else {
            // @ts-ignore
            const serviceIdentifier = Reflect.getMetadata('design:type', target, key);
            const finalConfig = Object.assign(Object.assign({}, exports.defaultInjectConfig(serviceIdentifier)), config);
            Registrer_1.default.registerAttributeInject(target.constructor, key, finalConfig);
        }
    };
};
/** Inject All */
exports.InjectAll = (identifier, refresh = false) => {
    return (target, key, index) => {
        if (typeof index === 'number') {
            if (key !== undefined) {
                throw new Errors_1.NotInConstructorError();
            }
            // @ts-ignore
            const constructorParamTypes = Reflect.getMetadata('design:paramtypes', target, key);
            const paramType = constructorParamTypes[index];
            if (paramType.name !== 'Array') {
                throw new Error(`@InjectAll decorator can only be used with an array parameter on service ${target.name}`);
            }
            Registrer_1.default.registerConstructorAllService(target, identifier, index, refresh);
        }
        else {
            Registrer_1.default.registerAttributeAllService(target.constructor, identifier, key, refresh);
        }
    };
};
/** Parameter injection */
exports.Parameter = (paramKey) => {
    return (target, key, index) => {
        if (typeof index === 'number') {
            if (key !== undefined) {
                throw new Errors_1.NotInConstructorError();
            }
            Registrer_1.default.registerConstructorParameter(target, index, paramKey);
        }
        else {
            Registrer_1.default.registerAttributeParameter(target.constructor, key, paramKey);
            Reflect.defineProperty(target, key, {
                get: () => Registrer_1.default.getContainer().getParameter(paramKey)
            });
        }
    };
};
//# sourceMappingURL=Decorators.js.map