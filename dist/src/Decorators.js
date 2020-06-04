import Registrer from './Metadata/Registrer';
import { IncorrectFactoryError, NotInConstructorError } from "./Errors";
;
export const SCOPES = {
    singleton: 'singleton',
    newable: 'renewable',
    custom: 'custom',
};
export const defaultConfig = (identifier) => ({
    identifier,
    tag: null,
    scoping: SCOPES.singleton,
    customScopes: []
});
export const Service = (config = {}) => {
    return (target) => {
        Registrer.registerService(target, Object.assign({}, defaultConfig(target), config));
    };
};
/** Factory */
export const Factory = (createdService, config = {}) => {
    return (factoryConstructor) => {
        const factory = new factoryConstructor();
        if (!('resolve' in factory)) {
            throw new IncorrectFactoryError(factoryConstructor);
        }
        const isPromise = Reflect.getMetadata('design:returntype', factory, 'resolve') === Promise;
        if (config.scoping && config.scoping !== SCOPES.singleton && isPromise) {
            throw new Error('Async factories MUST be scoped as singletons');
        }
        Registrer.registerFactory(factory, createdService, Object.assign({}, defaultConfig(createdService), config));
    };
};
export const defaultInjectConfig = (identifier) => ({
    identifier,
    tag: null,
    refresh: false,
});
export const Inject = (config = {}) => {
    return (target, key, index) => {
        if (typeof index === 'number') {
            if (key !== undefined) {
                throw new NotInConstructorError();
            }
            // @ts-ignore
            const constructorParamTypes = Reflect.getMetadata('design:paramtypes', target, key);
            const finalConfig = Object.assign({}, defaultInjectConfig(constructorParamTypes[index]), config);
            Registrer.registerConstructorInject(target, index, finalConfig);
        }
        else {
            // @ts-ignore
            const serviceIdentifier = Reflect.getMetadata('design:type', target, key);
            const finalConfig = Object.assign({}, defaultInjectConfig(serviceIdentifier), config);
            Registrer.registerAttributeInject(target.constructor, key, finalConfig);
        }
    };
};
/** Inject All */
export const InjectAll = (identifier, refresh = false) => {
    return (target, key, index) => {
        if (typeof index === 'number') {
            if (key !== undefined) {
                throw new NotInConstructorError();
            }
            // @ts-ignore
            const constructorParamTypes = Reflect.getMetadata('design:paramtypes', target, key);
            const paramType = constructorParamTypes[index];
            if (paramType.name !== 'Array') {
                throw new Error(`@InjectAll decorator can only be used with an array parameter on service ${target.name}`);
            }
            Registrer.registerConstructorAllService(target, identifier, index, refresh);
        }
        else {
            Registrer.registerAttributeAllService(target.constructor, identifier, key, refresh);
        }
    };
};
/** Parameter injection */
export const Parameter = (paramKey) => {
    return (target, key, index) => {
        if (typeof index === 'number') {
            if (key !== undefined) {
                throw new NotInConstructorError();
            }
            Registrer.registerConstructorParameter(target, index, paramKey);
        }
        else {
            Registrer.registerAttributeParameter(target.constructor, key, paramKey);
            Reflect.defineProperty(target, key, {
                get: () => Registrer.getContainer().getParameter(paramKey)
            });
        }
    };
};
