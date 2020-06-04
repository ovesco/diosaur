"use strict";
class LazyProxy {
    constructor(provider) {
        this.provider = provider;
        // We assume we're proxying over a javascript object
        this._instance = null;
        // keep a reference to this context, with access to get instance()
        const self = this;
        // given target is irrelevant, we won't use it
        return new Proxy({}, {
            get(_, key) {
                return self.instance[key];
            },
        });
    }
    get instance() {
        if (this._instance === null) {
            this._instance = this.provider(); // Load the service
        }
        return this._instance;
    }
}
const myObject = { hello: 'world' };
// this function generates my service
const generator = () => ({ hello: 'lazy world' });
// the generator is not called yet
// We need make typescript think it's dealing with the service
const lazyObject = new LazyProxy(generator);
console.log(myObject.hello); // world
// the generator is called and get(hello) is forwarded to the returned object
console.log(lazyObject.hello); // lazy world
