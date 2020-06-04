class LazyProxy {
    constructor(provider: () => {
        [key: string]: any;
    }) {
        const self = this;
        return new Proxy({}, {
            deleteProperty(_, key: string) {
                return delete provider()[key];
            },
            get(_, key: string) {
                return provider()[key];
            },
            set(_, key: string, value: any) {
                provider()[key] = value;
                return true;
            },
            getPrototypeOf(_) {
                return Reflect.getPrototypeOf(provider());
            },
            setPrototypeOf(_, proto: any) {
                return Reflect.setPrototypeOf(provider(), proto);
            },
            preventExtensions(_) {
                Reflect.preventExtensions(provider());
                return true;
            },
            getOwnPropertyDescriptor(_, prop: string) {
                return Reflect.getOwnPropertyDescriptor(provider(), prop);
            },
            defineProperty(_, prop: string, value: any) {
                return Reflect.defineProperty(provider(), prop, value);
            },
            has(_, key: string) {
                return key in provider();
            },
            ownKeys(_) {
                return Reflect.ownKeys(provider());
            },
            apply(_, thisArg: any, args: any[]) {
                return provider().apply(thisArg, args);
            },
            construct(_, args) {
                return Reflect.construct(provider() as Function, args);
            }
        }) as any;
    }
}
export default LazyProxy;
