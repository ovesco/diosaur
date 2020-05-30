import "reflect-metadata";
import { IContainer } from "./Container";
import { Constructor, ServiceClassIdentifier, ServiceIdentifier } from "./Types";
import { Service, Inject, InjectAll, Factory, Parameter } from './Decorators';
export { Service, Inject, InjectAll, Factory, Parameter, IContainer, };
export declare const getContainer: () => Promise<IContainer>;
export declare const setParameter: (key: string | symbol | Constructor, value: any) => void;
export declare const register: (serviceClass: ServiceClassIdentifier) => {
    as: (identifier: ServiceIdentifier, tag?: string | null) => {
        with: (fn: (() => Object | Promise<Object>) | Object) => void;
    };
};
