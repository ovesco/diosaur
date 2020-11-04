"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructorInjectedParameter = exports.AttributeInjectedParameter = exports.BaseInjectedParameter = void 0;
class BaseInjectedParameter {
    constructor(serviceClass, parameterKey) {
        this.serviceClass = serviceClass;
        this.parameterKey = parameterKey;
    }
}
exports.BaseInjectedParameter = BaseInjectedParameter;
class AttributeInjectedParameter extends BaseInjectedParameter {
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
exports.AttributeInjectedParameter = AttributeInjectedParameter;
class ConstructorInjectedParameter extends BaseInjectedParameter {
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
exports.ConstructorInjectedParameter = ConstructorInjectedParameter;
//# sourceMappingURL=ParameterInjection.js.map