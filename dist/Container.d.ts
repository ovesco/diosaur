import { Constructor, ServiceIdentifier, ServiceRegistry, ParameterBag } from "./Types";
export interface IContainer {
    getParameter(key: string | symbol | Constructor): string;
    get<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier, tag?: string | null): T;
    getAll<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier): T[];
}
export declare class Container implements IContainer {
    private registry;
    private parameters;
    constructor(registry: ServiceRegistry, parameters: ParameterBag);
    getParameter(key: string | symbol | Constructor): string;
    get<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier, tag?: string | null): T;
    getAll<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier): T[];
}
