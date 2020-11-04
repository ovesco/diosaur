declare class LazyProxy {
    constructor(provider: () => {
        [key: string]: any;
    });
}
export default LazyProxy;
