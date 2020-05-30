import { ServiceClassIdentifier, ServiceIdentifier } from "../Types";

export abstract class BaseInjectAllService {

    constructor(public readonly serviceClass: ServiceClassIdentifier,
        public readonly identifier: ServiceIdentifier) {}

    abstract getType(): 'attribute' | 'constructor';
}

export class AttributeInjectAllService extends BaseInjectAllService {

    constructor(public readonly serviceClass: ServiceClassIdentifier,
        public readonly identifier: ServiceIdentifier,
        public readonly paramKey: string | symbol) {
            super(serviceClass, identifier);
        }

    getType(): 'attribute' {
        return 'attribute';
    }
}

export class ConstructorInjectAllService extends BaseInjectAllService {

    constructor(public readonly serviceClass: ServiceClassIdentifier,
        public readonly identifier: ServiceIdentifier,
        public readonly index: number) {
            super(serviceClass, identifier);
        }

    getType(): 'constructor' {
        return 'constructor';
    }
}