export class BaseInjectedService {
    constructor(serviceClass, config) {
        this.serviceClass = serviceClass;
        this.config = config;
    }
}
export class AttributeInjectedService extends BaseInjectedService {
    constructor(serviceClass, attributeKey, config) {
        super(serviceClass, config);
        this.serviceClass = serviceClass;
        this.attributeKey = attributeKey;
        this.config = config;
    }
    getType() {
        return 'attribute';
    }
}
export class ConstructorInjectedService extends BaseInjectedService {
    constructor(serviceClass, index, config) {
        super(serviceClass, config);
        this.serviceClass = serviceClass;
        this.index = index;
        this.config = config;
    }
    getType() {
        return 'constructor';
    }
}
