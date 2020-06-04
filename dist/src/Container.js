export class Container {
    constructor(resolver) {
        this.resolver = resolver;
    }
    enterScope(scope) {
        this.resolver.enterScope(scope);
    }
    exitScope(scope) {
        this.resolver.exitScope(scope);
    }
    getParameter(key) {
        return this.resolver.getParameter(key);
    }
    get(targetType, tag = null) {
        return this.resolver.get(targetType, tag);
    }
    getAll(targetType) {
        return this.resolver.getAll(targetType);
    }
}
