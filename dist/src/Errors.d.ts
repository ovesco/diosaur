import { Constructor, ServiceIdentifier } from "./Types";
export declare class IncorrectFactoryError extends Error {
    constructor(identifier: Constructor);
}
export declare class CircularDependencyError extends Error {
    constructor();
}
export declare class MissingServiceDefinitionError extends Error {
}
export declare class NotInConstructorError extends Error {
    constructor();
}
export declare class UnregisteredServiceError extends Error {
    constructor(identifier: ServiceIdentifier, tag: string | null, multi?: boolean);
}
export declare class NotBuiltContainerError extends Error {
    constructor();
}
