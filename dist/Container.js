import { UnregisteredServiceError } from "./Errors";
import { resolveTag } from "./Utils";
export class Container {
    constructor(registry, parameters) {
        this.registry = registry;
        this.parameters = parameters;
    }
    getParameter(key) {
        return this.parameters.get(key) || null;
    }
    get(targetType, tag = null) {
        tag = resolveTag(tag, this.parameters);
        // @ts-ignore
        if (!this.registry.has(targetType) || !this.registry.get(targetType).has(tag)) {
            throw new UnregisteredServiceError(targetType, tag);
        }
        // @ts-ignore
        return this.registry.get(targetType).get(tag);
    }
    getAll(targetType) {
        if (!this.registry.has(targetType)) {
            throw new UnregisteredServiceError(targetType, null, true);
        }
        // @ts-ignore
        return Array.from(this.registry.get(targetType).values());
    }
}
