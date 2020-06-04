class LazyProxy {

    // We assume we're proxying over a javascript object
    private _instance: { [key: string]: any } | null = null;

    constructor(private provider: () => { [key: string]: any }) {
        // keep a reference to this context, with access to get instance()
        const self = this;

        // given target is irrelevant, we won't use it
        return new Proxy({}, {
            get(_, key: string) {
                return self.instance[key];
            },

            // add other traps...
        }) as any;
    }

    private get instance() {
        if (this._instance === null) {
            this._instance = this.provider(); // Load the service
        }
        return this._instance;
    }
}

const myObject = {hello: 'world'};

// this function generates my service
const generator = () => ({ hello: 'lazy world' });

// the generator is not called yet
// We need make typescript think it's dealing with the service
const lazyObject = new LazyProxy(generator) as any as { hello: string };

console.log(myObject.hello); // world

// the generator is called and get(hello) is forwarded to the returned object
console.log(lazyObject.hello); // lazy world
