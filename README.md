<p align="center">
    <img width="200" src="https://user-images.githubusercontent.com/8458666/83355360-616d6000-a35f-11ea-9078-732542670707.jpg">
</p>

# Diosaur
#### A small dependency injection library with no dependencies except for `reflect-metadata` built for Deno using Denoify.
This is a side project I'm using in other side projects, it works well but maybe don't use it in production yet.

Diosaur is a small dependency injection solution written in Typescript for Deno and node which aims at making you write the minimum
of code, avoiding obvious bindings and other repetitive stuff. It internally depends on `reflect-metadata` to guess
the maximum indications out of your code, but still allows you for finer definition of your services.

## Reflect Metadata
As Diosaur relies on `reflect-metadata` and this library was not officially ported to Deno yet, you'll need
to import it manually in your project.


## Example
```typescript
/** Deno **/
// Import reflect-metadata
import 'https://raw.githubusercontent.com/rbuckton/reflect-metadata/master/Reflect.js';

// Import diosaur
import { Service, Parameter, Inject, setParameter, getContainer } from 'https://raw.githubusercontent.com/ovesco/diosaur/master/mod.ts';

/** Node **/
// Import reflect-metadata, first install it `npm install --save reflect-metadata`
import 'reflect-metadata';

// Import diosaur
import { Service, Parameter, Inject } from 'diosaur';

@Service()
class Doggo {
    constructor(@Parameter('doggoName') private name: string) {}

    bark() {
        return this.name.toUpperCase();
    }
}

@Service()
class JonSnow {

    @Inject()
    private doggo: Doggo;

    yell() {
        return `I'm Jon with my doggo ${this.doggo.bark()} !`;
    }
}

setParameter('doggoName', 'Ghost');
getContainer().then((container) => {
    const jon = container.get(JonSnow);
    console.log(jon.yell());
});
```

## How does it work
Generally speaking, a dependency injection library handles the lifecycle of your
services, which means that you don't have to create or remove them, it's handled
by the container. In Diosaur, services are Typescript `class` decorated with the
`@Service` decorator as illustrated in the upper example.

### Injecting services
Another purpose of dependency injection is actually managing your dependencies for you.
You can as such inject other services into your service using the `@Inject` decorator.
```typescript
@Service()
class RedisCache {
    get = (key: string) => // ...
    
    set = (key: string, value: string) => // ...
}

@Service()
class MyService {

    // Injecting as attribute
    @Inject()
    private cache: RedisCache;

    // Or you can also inject it as parameter in the constructor
    constructor(@Inject() private cache: RedisCache) {}
}
```
The difference between the two types of injection is that:
- As attribute, whenever you access your service, it will be resolved in the container.
**This means that you cannot use a service injected as attribute within your constructor,
it might not be ready yet**
- As constructor parameter, where it is guaranteed to be available within the constructor

### Injecting parameters
Diosaur allows you to register and inject parameters within your services. Just like Service
injection, parameter injection works using the `@Parameter` decorator.
```typescript
@Service()
class MyService {

    // Injecting as attribute
    @Parameter("paramKey")
    private param: string;

    // Or injecting as constructor parameter
    constructor(@Parameter("paramKey") private param: string) {}
}

// ...
Diosaur.setParameter('paramKey', 'A great value!');
```

### Abstracting your service concrete type
As you don't have to create your services by yourself, you can also abstract your
service type. For example given the redis cache manager from the previous example, we could
make it implement the following interface:
```typescript
interface CacheInterface {
    get(key: string): string;

    set(key: string, value: string): void;
}

@Service({ identifier: 'cache', tag: 'redis' })
class RedisCache implements CacheInterface { /* ... */ }

@Service({ identifier: 'cache', tag: 'memcached' })
class MemcachedCache implements CacheInterface { /* ... */ }
```

We could imagine an application where you'd have multiple implementations of that
interface, one with Redis, another with Memcached and so on, but it doesn't matter
to you, all you need to know is that it does implement `CacheInterface`. That's why
Diosaur makes a difference between:
- Your service class
- Your service **identifier** (which by default is your service class), which you'll use
to resolve your service
- An optionnal tag

In the upper example, we have defined two caching services which:
- can be resolved with the `cache` identifier
- are specifically tagged with `redis` or `memcached`

You could then inject one or the other as you wish like so:
```typescript
@Service()
class MyService {

    @Inject({ identifier: 'cache', tag: 'redis' })
    private cache: CacheInterface;
}
```

### Using parameter as tag value
You can also use a parameter as tag to dynamically set which implementation
to use using the `@paramKey` notation.

```typescript
@Service()
class MyService {

    @Inject({ identifier: 'cache', tag: '@cacheImplementation' })
    private cache: CacheInterface;
}

// ...
Diosaur.setParameter('cacheImplementation', 'redis');
```

### Injecting all services of a given identifier
If you need to inject all services of a given identifier, you can use the
`@InjectAll` decorator. Given all previous examples:
```typescript
interface CacheInterface { /* ... */ }

@Service({ tag: 'redis' })
class RedisCache implements CacheInterface { /* ... */ }

@Service({ tag: 'memcached' })
class MemcachedCache implements CacheInterface { /* ... */ }

@Service()
class MyService {

    // Injecting as attribute
    @InjectAll(CacheInterface)
    private caches: CacheInterface[];

    // Or injecting as constructor parameter
    constructor(@InjectAll(CacheInterface) private caches: CacheInterface[]) {}
}
```

`caches` will contain an instance of both RedisCache and MemcachedCache.
**Please note** that you must provide the service identifier to InjectAll, even if the type
of your variable or attribute is the identifier. That's because we can't infer the
type of an array in Typescript.

## Building the container
Diosaur follows a strict flow to manage your services.
1. All metadata about your services, injecting and more is gathered into a singleton object called
the `GlobalRegistrer`.
2. Once this is done, you can ask Diosaur to build the container. This will trigger the creation
of a dependency graph which will be progressively resolved
3. After that the container is exposed and it is impossible to register new services or parameters.

A standard application using Diosaur will have an entry point which might look like this.
```typescript
import * as Diosaur from '...';
// Other imports ...

Diosaur.setParameter('param1', 'value1');
// Other parameters

Diosaur.getContainer().then((container) => {
    // container is now available, if express you'd create your server here for example
});
```

## Using factories
Until now we've seen how to create services directly from classes, but you might have to perform
some advanced work before being able to do it. That's where factories come in handy, in fact, simply
using `@Service` internally creates a dummy factory!

### Anonymous factories
You can create anonymous factories (functions returning your service) like so.
```typescript

// Note that you don't anotate your class with @Service!
class MyComplexService {

    @Inject()
    private deps: SomeDependency;

    constructor(ioStuff: any) {}
}

// Before building the container
Diosaur.register(MyComplexService) // The service class
    .as(MyComplexService, 'a tag') // The identifier and optionnal tag
    .with(async (...data: any[]) => { // Support for async functions and promises!
        const res = await someLongIOWork();
        return new MyComplexService(res);
    });
```

### Injecting objects as services
You might want to inject already existing objects as service which you can do just
as using anonymous factories.
```typescript
const myObj: ServiceClass = console;

Diosaur.register('my-great-console') // The service class identifier
    .as('my-console', null) // This time a string identifier with no tag
    .with(myObj);

Diosaur.getContainer().then((container) => {
    container.get('my-great-console').log('youhouu');
});
```

### Creating class factories
You can also create factories as class which can be done like so.
Please note that a factory class **must** implement the IFactory interface.
```typescript

// Note the lack of @Service tag too
class MyComplexService {

    constructor(@Inject() dep1: SomeDependency) {}
}

@Factory(MyComplexService)
class MyFactory implements IFactory {

    async resolve(data: any[]) {
        await someDeepIOStuff();
        return new MyComplexService(...data: any[]);
    }
}
```
This example illustrates another concept which is that factories can inject
constructor dependencies.

### Factories with constructor injected dependencies
You might have noticed in factories examples that there's a `data: any[]` parameter
in the `IFactory::resolve` and when doing an anonymous factory. That's because you
might want to inject some dependencies in your service constructor from within the
factory.

When Diosaur will be ready to call your factory's `resolve` method, it will provide
all dependencies it found for it, in the correct order. You can then simply do a 
`new MyService(...data)` to inject all dependencies.

## API
### Diosaur types
```typescript
type Constructor = new (...args: any[]) => {};

type ServiceIdentifier = string | symbol | Constructor;

type ServiceClassIdentifier = string | symbol | Constructor;

type parameterKey = string | symbol | Constructor;
```
As you can see, you can pass either a `string`, a `symbol` or a `Constructor` (which is simply
giving the class of your service) as:
- serviceIdentifier used in `container.get(serviceIdentifier, tag)`
- serviceClassIdentifier, very important to be **unique** accross all your services, highly encouraged
to use your service class here
- parameterKey, how you'll reference your parameters

### Decorators
```typescript
// Declare a service with this decorator
@Service({ identifier?: ServiceIdentifier, tag?: string })

// Inject a service into another as a dependency, either as class attribute or
// decorator parameter. Please note that tag can take the @paramKey
// to inject a parameter value as tag
@Inject({ identifier?: ServiceIdentifier, tag?: string })

// Inject all services of the provided identifier
@InjectAll(ServiceIdentifier)

// Inject the parameter identified with the given parameterKey
@Parameter(parameterKey: string)

// Declares the given class as a factory, must implement IFactory.
@Factory(ServiceClassIdentifier, { identifier?: ServiceIdentifier, tag?: string })
```

By default, the *serviceIdentifier* is infered from the attribute/parameter type which the
decorator is attached to.

### Diosaur class API
```typescript
// Register some parameters
Diosaur.setParameter(parameterKey, any);

// Register dynamic services
Diosaur.register(serviceUNIQUEIdentifier: ServiceClassIdentifier)
    .as(identifier: ServiceIdentifier, tag?: string | null)
    .with(((...data: any[]) => Promise<Object> | Object) | Object);

// Build the container and make it available
Diosaur.getContainer().then((container) => {
    // Container built and available

    // Retrieves a service
    container.get(identifier: ServiceIdentifier, tag?: string | null): Object;

    // Retrieves all services of given identifier
    container.getAll(identifier: ServiceIdentifier): Object[];

    // Retrieves a parameter value
    container.getParameter(parameterKey: ParameterKey): any;
});
```
