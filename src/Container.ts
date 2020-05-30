import { Constructor, ServiceIdentifier, ServiceRegistry, ParameterBag } from "./Types";
import { UnregisteredServiceError } from "./Errors";
import { resolveTag } from "./Utils";

export interface IContainer {

    getParameter(key: string | symbol | Constructor): string;

    get<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier, tag?: string | null): T;

    getAll<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier): T[];
}

export class Container implements IContainer {

    constructor(private registry: ServiceRegistry, private parameters: ParameterBag) {
    }

    getParameter(key: string | symbol | Constructor): string {
        return this.parameters.get(key) || null;
    }

    get<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier, tag: string | null = null): T {
        tag = resolveTag(tag, this.parameters);
        // @ts-ignore
        if (!this.registry.has(targetType) || !this.registry.get(targetType).has(tag)) {
            throw new UnregisteredServiceError(targetType, tag);
        }
        // @ts-ignore
        return this.registry.get(targetType).get(tag) as T;
    }

    getAll<T>(targetType: (new (...args: any[]) => T) | ServiceIdentifier): T[] {
        if (!this.registry.has(targetType)) {
            throw new UnregisteredServiceError(targetType, null, true);
        }
        // @ts-ignore
        return Array.from(this.registry.get(targetType).values()) as T[];
    }
}
