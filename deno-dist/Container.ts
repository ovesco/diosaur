import { Constructor, ServiceIdentifier } from "./Types.ts";
import ServiceResolver from "./Compilation/ServiceResolver.ts";
export interface IContainer {
    enterScope(scope: string): void;
    exitScope(scope: string): void;
    getParameter(key: string | symbol | Constructor): string;
    get<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier, tag?: string | null): T;
    getAll<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier): T[];
}
export class Container implements IContainer {
    constructor(private resolver: ServiceResolver) {
    }
    enterScope(scope: string) {
        this.resolver.enterScope(scope);
    }
    exitScope(scope: string) {
        this.resolver.exitScope(scope);
    }
    getParameter(key: string | symbol | Constructor): string {
        return this.resolver.getParameter(key);
    }
    get<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier, tag: string | null = null): T | any {
        return this.resolver.get(targetType, tag) as T | any;
    }
    getAll<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier): (T | any)[] {
        return this.resolver.getAll(targetType) as T[] | any[];
    }
}
