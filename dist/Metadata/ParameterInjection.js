export class BaseInjectedParameter {
    constructor(serviceClass, parameterKey) {
        this.serviceClass = serviceClass;
        this.parameterKey = parameterKey;
    }
}
export class ConstructorInjectedParameter extends BaseInjectedParameter {
    constructor(serviceClass, index, parameterKey) {
        super(serviceClass, parameterKey);
        this.serviceClass = serviceClass;
        this.index = index;
        this.parameterKey = parameterKey;
    }
    getType() {
        return 'constructor';
    }
}
export class AttributeInjectedParameter extends BaseInjectedParameter {
    constructor(serviceClass, key, parameterKey) {
        super(serviceClass, parameterKey);
        this.serviceClass = serviceClass;
        this.key = key;
        this.parameterKey = parameterKey;
    }
    getType() {
        return 'attribute';
    }
}
