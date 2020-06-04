import { ServiceClassIdentifier, ServiceIdentifier } from "../Types";

export abstract class BaseInjectAllService {

    constructor(public readonly serviceClass: ServiceClassIdentifier,
        public readonly identifier: ServiceIdentifier,
        public readonly refresh: boolean) {}

    abstract getType(): 'attribute' | 'constructor';
}

export class AttributeInjectAllService extends BaseInjectAllService {

    constructor(public readonly serviceClass: ServiceClassIdentifier,
        public readonly identifier: ServiceIdentifier,
        public readonly attributeKey: string | symbol,
        public readonly refresh: boolean) {
            super(serviceClass, identifier, refresh);
        }

    getType(): 'attribute' {
        return 'attribute';
    }
}

export class ConstructorInjectAllService extends BaseInjectAllService {

    constructor(public readonly serviceClass: ServiceClassIdentifier,
        public readonly identifier: ServiceIdentifier,
        public readonly index: number,
        public readonly refresh: boolean) {
            super(serviceClass, identifier, refresh);
        }

    getType(): 'constructor' {
        return 'constructor';
    }
}