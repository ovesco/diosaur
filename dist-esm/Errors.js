export class IncorrectFactoryError extends Error {
    constructor(identifier) {
        super(`Factory ${identifier.toString()} must implement the IFactory interface`);
    }
}
export class CircularDependencyError extends Error {
    constructor() {
        super('Circular dependency detected in dependency graph which is not supported yet');
    }
}
export class MissingServiceDefinitionError extends Error {
}
export class NotInConstructorError extends Error {
    constructor() {
        super('Injecting services or parameters as method parameter can only take place in service constructor');
    }
}
export class UnregisteredServiceError extends Error {
    constructor(identifier, tag, multi = false) {
        const multiStr = multi ? 'while trying to inject all of them' : `with tag ${tag}`;
        super(`No service registered with identifier ${identifier.toString()} ${multiStr}`);
    }
}
export class NotBuiltContainerError extends Error {
    constructor() {
        super('Container not yet built, you cannot query it');
    }
}
//# sourceMappingURL=Errors.js.map