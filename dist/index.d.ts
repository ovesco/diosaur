import { IContainer } from "./Container";
import { ServiceIdentifier } from "./Types";
import { Service, Inject, InjectAll, Factory, Parameter } from './Decorators';
export { Service, Inject, InjectAll, Factory, Parameter, IContainer, };
export declare const getContainer: () => Promise<IContainer>;
export declare const setParameter: (key: ServiceIdentifier, value: any) => void;
export declare const register: (serviceClass: ServiceIdentifier) => {
    as: (identifier: ServiceIdentifier, tag?: string | null) => {
        with: (fn: Object | (() => Object | Promise<Object>)) => void;
    };
};
