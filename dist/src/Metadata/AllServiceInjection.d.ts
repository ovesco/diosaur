import { ServiceClassIdentifier, ServiceIdentifier } from "../Types";
export declare abstract class BaseInjectAllService {
    readonly serviceClass: ServiceClassIdentifier;
    readonly identifier: ServiceIdentifier;
    readonly refresh: boolean;
    constructor(serviceClass: ServiceClassIdentifier, identifier: ServiceIdentifier, refresh: boolean);
    abstract getType(): 'attribute' | 'constructor';
}
export declare class AttributeInjectAllService extends BaseInjectAllService {
    readonly serviceClass: ServiceClassIdentifier;
    readonly identifier: ServiceIdentifier;
    readonly attributeKey: string | symbol;
    readonly refresh: boolean;
    constructor(serviceClass: ServiceClassIdentifier, identifier: ServiceIdentifier, attributeKey: string | symbol, refresh: boolean);
    getType(): 'attribute';
}
export declare class ConstructorInjectAllService extends BaseInjectAllService {
    readonly serviceClass: ServiceClassIdentifier;
    readonly identifier: ServiceIdentifier;
    readonly index: number;
    readonly refresh: boolean;
    constructor(serviceClass: ServiceClassIdentifier, identifier: ServiceIdentifier, index: number, refresh: boolean);
    getType(): 'constructor';
}
