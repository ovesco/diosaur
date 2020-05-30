import { ServiceClassIdentifier, Constructor } from "../Types";
export declare abstract class BaseInjectedParameter {
    readonly serviceClass: ServiceClassIdentifier;
    readonly parameterKey: string | symbol | Constructor;
    constructor(serviceClass: ServiceClassIdentifier, parameterKey: string | symbol | Constructor);
    abstract getType(): 'attribute' | 'constructor';
}
export declare class ConstructorInjectedParameter extends BaseInjectedParameter {
    readonly serviceClass: ServiceClassIdentifier;
    readonly index: number;
    readonly parameterKey: string | symbol | Constructor;
    constructor(serviceClass: ServiceClassIdentifier, index: number, parameterKey: string | symbol | Constructor);
    getType(): 'constructor';
}
export declare class AttributeInjectedParameter extends BaseInjectedParameter {
    readonly serviceClass: ServiceClassIdentifier;
    readonly key: string | symbol;
    readonly parameterKey: string | symbol | Constructor;
    constructor(serviceClass: ServiceClassIdentifier, key: string | symbol, parameterKey: string | symbol | Constructor);
    getType(): 'attribute';
}
