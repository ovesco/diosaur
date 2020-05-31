import 'reflect-metadata';

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

export const setParameter = (key: string | symbol | Constructor, value: any) => {
    Registrer.setParameter(key, value);
};

export const register = (serviceClass: ServiceClassIdentifier) => {
    return { as: (identifier: ServiceIdentifier, tag: string | null = null) => {
        return { with: (fn: (() => Object | Promise<Object>) | Object) => {
            const cb = (typeof fn !== 'function') ? () => fn : fn;
            const factory = new FunctionFactory(cb as () => Object);
            Registrer.registerFactory(factory, serviceClass, {
                identifier,
                tag
            });
        }};
    }};
};