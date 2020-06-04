export class BaseInjectAllService {
    constructor(serviceClass, identifier, refresh) {
        this.serviceClass = serviceClass;
        this.identifier = identifier;
        this.refresh = refresh;
    }
}
export class AttributeInjectAllService extends BaseInjectAllService {
    constructor(serviceClass, identifier, attributeKey, refresh) {
        super(serviceClass, identifier, refresh);
        this.serviceClass = serviceClass;
        this.identifier = identifier;
        this.attributeKey = attributeKey;
        this.refresh = refresh;
    }
    getType() {
        return 'attribute';
    }
}
export class ConstructorInjectAllService extends BaseInjectAllService {
    constructor(serviceClass, identifier, index, refresh) {
        super(serviceClass, identifier, refresh);
        this.serviceClass = serviceClass;
        this.identifier = identifier;
        this.index = index;
        this.refresh = refresh;
    }
    getType() {
        return 'constructor';
    }
}
