import { ServiceClassIdentifier, ServiceIdentifier } from "../Types";
export declare abstract class BaseInjectAllService {
    readonly serviceClass: ServiceClassIdentifier;
    readonly identifier: ServiceIdentifier;
    constructor(serviceClass: ServiceClassIdentifier, identifier: ServiceIdentifier);
    abstract getType(): 'attribute' | 'constructor';
}
export declare class AttributeInjectAllService extends BaseInjectAllService {
    readonly serviceClass: ServiceClassIdentifier;
    readonly identifier: ServiceIdentifier;
    readonly paramKey: string | symbol;
    constructor(serviceClass: ServiceClassIdentifier, identifier: ServiceIdentifier, paramKey: string | symbol);
    getType(): 'attribute';
}
export declare class ConstructorInjectAllService extends BaseInjectAllService {
    readonly serviceClass: ServiceClassIdentifier;
    readonly identifier: ServiceIdentifier;
    readonly index: number;
    constructor(serviceClass: ServiceClassIdentifier, identifier: ServiceIdentifier, index: number);
    getType(): 'constructor';
}
