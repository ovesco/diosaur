export class BaseInjectAllService {
    constructor(serviceClass, identifier) {
        this.serviceClass = serviceClass;
        this.identifier = identifier;
    }
}
export class AttributeInjectAllService extends BaseInjectAllService {
    constructor(serviceClass, identifier, paramKey) {
        super(serviceClass, identifier);
        this.serviceClass = serviceClass;
        this.identifier = identifier;
        this.paramKey = paramKey;
    }
    getType() {
        return 'attribute';
    }
}
export class ConstructorInjectAllService extends BaseInjectAllService {
    constructor(serviceClass, identifier, index) {
        super(serviceClass, identifier);
        this.serviceClass = serviceClass;
        this.identifier = identifier;
        this.index = index;
    }
    getType() {
        return 'constructor';
    }
}
