import { ServiceClassIdentifier, ServiceIdentifier, Constructor } from "./Types.ts";
import Registrer from './Metadata/Registrer.ts';
import { IncorrectFactoryError, NotInConstructorError } from "./Errors.ts";


/** Service */
export interface ServiceConfig {
    identifier: ServiceIdentifier;
    tag: string | null;
};

export const defaultConfig = (identifier: ServiceIdentifier): ServiceConfig => ({
    identifier,
    tag: null,
});

export const Service = (config: Partial<ServiceConfig> = {}) => {
    return <T extends Constructor>(target: T) => {
        Registrer.registerService(target, {
            ...defaultConfig(target),
            ...config
        });
    }
};


/** Factory */
export const Factory = (createdService: ServiceClassIdentifier, config: Partial<ServiceConfig> = {}) => {

    return <T extends Constructor>(factoryConstructor: T) => {

        const factory = new factoryConstructor();
        if (!('resolve' in factory)) {
            throw new IncorrectFactoryError(factoryConstructor);
        }

        Registrer.registerFactory(factory, createdService, {
            ...defaultConfig(createdService),
            ...config,
        });
    }
};


/** Inject */
export interface InjectConfig {
    tag: string | null;
    identifier: ServiceIdentifier;
}

export const defaultInjectConfig = (identifier: ServiceIdentifier) => ({
    identifier,
    tag: null,
});

export const Inject = (config: Partial<InjectConfig> = {}) => {

    return (target: any, key: string | symbol, index?: number) => {

        if (typeof index === 'number') {
            if (key !== undefined) {
                throw new NotInConstructorError();
            }

            // @ts-ignore
            const constructorParamTypes = Reflect.getMetadata('design:paramtypes', target, key);
            const finalConfig = { ...defaultInjectConfig(constructorParamTypes[index]), ...config };
            Registrer.registerConstructorInject(target, index, finalConfig);
        } else {

            // @ts-ignore
            const serviceIdentifier = Reflect.getMetadata('design:type', target, key);
            const finalConfig = { ...defaultInjectConfig(serviceIdentifier), ...config };    
            Registrer.registerAttributeInject(target.constructor, key, finalConfig);
            Reflect.defineProperty(target, key, {
                get: () => Registrer.getContainer().get(finalConfig.identifier as any, finalConfig.tag)
            });
        }
    };
};


/** Inject All */
export const InjectAll = (identifier: ServiceIdentifier) => {

    return (target: any, key: string | symbol, index?: number) => {

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
            Registrer.registerConstructorAllService(target, identifier, index);
        } else {
            Registrer.registerAttributeAllService(target.constructor, identifier, key);
            Reflect.defineProperty(target, key, {
                get: () => Registrer.getContainer().getAll(identifier as any),
            });
        }
    };
};


/** Parameter injection */
export const Parameter = (paramKey: string | symbol | Constructor) => {
    return (target: any, key: string | symbol, index?: number) => {
        if (typeof index === 'number') {
            if (key !== undefined) {
                throw new NotInConstructorError();
            }

            Registrer.registerConstructorParameter(target, index, paramKey);
        } else {
            Registrer.registerAttributeParameter(target.constructor, key, paramKey);
            Reflect.defineProperty(target, key, {
                get: () => Registrer.getContainer().getParameter(paramKey)
            });
        }
    };
};