import { Constructor, ServiceIdentifier } from "./Types";
import ServiceResolver from "./Compilation/ServiceResolver";
export interface IContainer {
    enterScope(scope: string): void;
    exitScope(scope: string): void;
    getParameter(key: string | symbol | Constructor): string;
    get<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier, tag?: string | null): T;
    getAll<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier): T[];
}
export declare class Container implements IContainer {
    private resolver;
    constructor(resolver: ServiceResolver);
    enterScope(scope: string): void;
    exitScope(scope: string): void;
    getParameter(key: string | symbol | Constructor): string;
    get<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier, tag?: string | null): T | any;
    getAll<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier): (T | any)[];
}
