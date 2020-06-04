import { IContainer } from "./Container";
import Registrer from "./Metadata/Registrer";
import { Constructor, ServiceClassIdentifier, ServiceIdentifier } from "./Types";
import { FunctionFactory } from "./Factory";

import {
    Service,
    Inject,
    InjectAll,
    Factory,
    Parameter,
    ServiceConfig,
    defaultConfig,
    SCOPES,
} from './Decorators';

export {
    Service,
    Inject,
    InjectAll,
    Factory,
    Parameter,
    IContainer,
}

export const getContainer = async (): Promise<IContainer> => {
    return await Registrer.build();
};

export const refreshContainer = async (): Promise<IContainer> => {
    return await Registrer.build(true);
};

export const setParameter = (key: string | symbol | Constructor, value: any) => {
    Registrer.setParameter(key, value);
};

type anonymousFactory = ((args: any[]) => Object) | Object;
type asyncAnonymousFactory = ((args: any[]) => Object | Promise<Object>) | Object | Promise<Object>;

export const register = (identifier: ServiceIdentifier, factory: anonymousFactory, config: Partial<ServiceConfig> = {}) => {
    const maker = typeof factory === 'function' ? factory : () => factory;
    const fnFactory = new FunctionFactory(maker as () => Object);
    Registrer.registerFactory(fnFactory, Symbol(identifier.toString()), {...defaultConfig(identifier), ...config});
};

export const registerAsync = (identifier: ServiceIdentifier, factory: asyncAnonymousFactory, config: Partial<ServiceConfig> = {}) => {
    const maker = typeof factory === 'function' ? factory : () => factory;
    const finalConfig = {...defaultConfig(identifier), ...config};
    const fnFactory = new FunctionFactory(maker as () => Object);
    if (finalConfig.scoping !== SCOPES.singleton) {
        throw new Error('Dynamically registered async factories must be registered as singletons');
    }
    Registrer.registerFactory(fnFactory, Symbol(identifier.toString()), finalConfig);
};