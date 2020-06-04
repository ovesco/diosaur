declare class LazyProxy {
    private provider;
    private _instance;
    constructor(provider: () => {
        [key: string]: any;
    });
    private readonly instance;
}
declare const myObject: {
    hello: string;
};
declare const generator: () => {
    hello: string;
};
declare const lazyObject: {
    hello: string;
};
