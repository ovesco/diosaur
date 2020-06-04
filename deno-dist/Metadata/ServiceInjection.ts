import { ServiceClassIdentifier } from "../Types.ts";
import { InjectConfig } from "../Decorators.ts";
export abstract class BaseInjectedService {
    constructor(public readonly serviceClass: ServiceClassIdentifier, public readonly config: InjectConfig) {
    }
    abstract getType(): "attribute" | "constructor";
}
export class AttributeInjectedService extends BaseInjectedService {
    constructor(public readonly serviceClass: ServiceClassIdentifier, public readonly attributeKey: string | symbol, public readonly config: InjectConfig) {
        super(serviceClass, config);
    }
    getType(): "attribute" {
        return "attribute";
    }
}
export class ConstructorInjectedService extends BaseInjectedService {
    constructor(public readonly serviceClass: ServiceClassIdentifier, public readonly index: number, public readonly config: InjectConfig) {
        super(serviceClass, config);
    }
    getType(): "constructor" {
        return "constructor";
    }
}
