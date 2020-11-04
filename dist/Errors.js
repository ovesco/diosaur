"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotBuiltContainerError = exports.UnregisteredServiceError = exports.NotInConstructorError = exports.MissingServiceDefinitionError = exports.CircularDependencyError = exports.IncorrectFactoryError = void 0;
class IncorrectFactoryError extends Error {
    constructor(identifier) {
        super(`Factory ${identifier.toString()} must implement the IFactory interface`);
    }
}
exports.IncorrectFactoryError = IncorrectFactoryError;
class CircularDependencyError extends Error {
    constructor() {
        super('Circular dependency detected in dependency graph which is not supported yet');
    }
}
exports.CircularDependencyError = CircularDependencyError;
class MissingServiceDefinitionError extends Error {
}
exports.MissingServiceDefinitionError = MissingServiceDefinitionError;
class NotInConstructorError extends Error {
    constructor() {
        super('Injecting services or parameters as method parameter can only take place in service constructor');
    }
}
exports.NotInConstructorError = NotInConstructorError;
class UnregisteredServiceError extends Error {
    constructor(identifier, tag, multi = false) {
        const multiStr = multi ? 'while trying to inject all of them' : `with tag ${tag}`;
        super(`No service registered with identifier ${identifier.toString()} ${multiStr}`);
    }
}
exports.UnregisteredServiceError = UnregisteredServiceError;
class NotBuiltContainerError extends Error {
    constructor() {
        super('Container not yet built, you cannot query it');
    }
}
exports.NotBuiltContainerError = NotBuiltContainerError;
//# sourceMappingURL=Errors.js.map