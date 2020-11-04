export class BaseInjectedParameter {
    constructor(serviceClass, parameterKey) {
        this.serviceClass = serviceClass;
        this.parameterKey = parameterKey;
    }
}
export class AttributeInjectedParameter extends BaseInjectedParameter {
    constructor(serviceClass, attributeKey, parameterKey) {
        super(serviceClass, parameterKey);
        this.serviceClass = serviceClass;
        this.attributeKey = attributeKey;
        this.parameterKey = parameterKey;
    }
    getType() {
        return 'attribute';
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
//# sourceMappingURL=ParameterInjection.js.map