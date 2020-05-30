import { ServiceClassIdentifier } from "../Types";
import { InjectConfig } from "../Decorators";
export declare abstract class BaseInjectedService {
    readonly serviceClass: ServiceClassIdentifier;
    readonly config: InjectConfig;
    constructor(serviceClass: ServiceClassIdentifier, config: InjectConfig);
    abstract getType(): 'attribute' | 'constructor';
}
export declare class AttributeInjectedService extends BaseInjectedService {
    readonly serviceClass: ServiceClassIdentifier;
    readonly attributeKey: string | symbol;
    readonly config: InjectConfig;
    constructor(serviceClass: ServiceClassIdentifier, attributeKey: string | symbol, config: InjectConfig);
    getType(): 'attribute';
}
export declare class ConstructorInjectedService extends BaseInjectedService {
    readonly serviceClass: ServiceClassIdentifier;
    readonly index: number;
    readonly config: InjectConfig;
    constructor(serviceClass: ServiceClassIdentifier, index: number, config: InjectConfig);
    getType(): 'constructor';
}
