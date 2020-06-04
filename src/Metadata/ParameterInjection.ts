import { ServiceClassIdentifier, Constructor } from "../Types";

export abstract class BaseInjectedParameter {
    constructor(public readonly serviceClass: ServiceClassIdentifier,
        public readonly parameterKey: string | symbol | Constructor) {
        }

    abstract getType(): 'attribute' | 'constructor';
}

export class AttributeInjectedParameter extends BaseInjectedParameter {

    constructor(public readonly serviceClass: ServiceClassIdentifier,
        public readonly attributeKey: string | symbol,
        public readonly parameterKey: string | symbol | Constructor) {
            super(serviceClass, parameterKey);
        }

    getType(): 'attribute' {
        return 'attribute';
    }
}

export class ConstructorInjectedParameter extends BaseInjectedParameter {
    constructor(public readonly serviceClass: ServiceClassIdentifier,
        public readonly index: number,
        public readonly parameterKey: string | symbol | Constructor) {
            super(serviceClass, parameterKey);
        }

    getType(): 'constructor' {
        return 'constructor';
    }
}