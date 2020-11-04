"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructorInjectAllService = exports.AttributeInjectAllService = exports.BaseInjectAllService = void 0;
class BaseInjectAllService {
    constructor(serviceClass, identifier, refresh) {
        this.serviceClass = serviceClass;
        this.identifier = identifier;
        this.refresh = refresh;
    }
}
exports.BaseInjectAllService = BaseInjectAllService;
class AttributeInjectAllService extends BaseInjectAllService {
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
exports.AttributeInjectAllService = AttributeInjectAllService;
class ConstructorInjectAllService extends BaseInjectAllService {
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
exports.ConstructorInjectAllService = ConstructorInjectAllService;
//# sourceMappingURL=AllServiceInjection.js.map