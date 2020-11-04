"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructorInjectedService = exports.AttributeInjectedService = exports.BaseInjectedService = void 0;
class BaseInjectedService {
    constructor(serviceClass, config) {
        this.serviceClass = serviceClass;
        this.config = config;
    }
}
exports.BaseInjectedService = BaseInjectedService;
class AttributeInjectedService extends BaseInjectedService {
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
exports.AttributeInjectedService = AttributeInjectedService;
class ConstructorInjectedService extends BaseInjectedService {
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
exports.ConstructorInjectedService = ConstructorInjectedService;
//# sourceMappingURL=ServiceInjection.js.map