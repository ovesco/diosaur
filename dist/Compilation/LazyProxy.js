"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LazyProxy {
    constructor(provider) {
        const self = this;
        return new Proxy({}, {
            deleteProperty(_, key) {
                return delete provider()[key];
            },
            get(_, key) {
                return provider()[key];
            },
            set(_, key, value) {
                provider()[key] = value;
                return true;
            },
            getPrototypeOf(_) {
                return Reflect.getPrototypeOf(provider());
            },
            setPrototypeOf(_, proto) {
                return Reflect.setPrototypeOf(provider(), proto);
            },
            preventExtensions(_) {
                Reflect.preventExtensions(provider());
                return true;
            },
            getOwnPropertyDescriptor(_, prop) {
                return Reflect.getOwnPropertyDescriptor(provider(), prop);
            },
            defineProperty(_, prop, value) {
                return Reflect.defineProperty(provider(), prop, value);
            },
            has(_, key) {
                return key in provider();
            },
            ownKeys(_) {
                return Reflect.ownKeys(provider());
            },
            apply(_, thisArg, args) {
                return provider().apply(thisArg, args);
            },
            construct(_, args) {
                return Reflect.construct(provider(), args);
            }
        });
    }
}
exports.default = LazyProxy;
//# sourceMappingURL=LazyProxy.js.map