# Factories
Diosaur allows you to declare factories to create your services. These make
it possible to register anything as a service in Diosaur.

## Class factories
All class factories must implement the `IFactory` interface as well as
be decorated with `@Factory`.

```typescript
class MyService {
    constructor(@Parameter('param') private param: string) {}
}

@Factory(MyService, { /* other settings like tag, scope... */ })
class MyFactory implements IFactory {
    resolve(params: any[]) {
        // Using reflect to build your service
        return Reflect.construct(MyService, params);

        // Building it manually
        return new MyService(...params);
    }
}
```

The factory decorator takes a mandatory argument which is the service identifier.
It can take a second optional argument to change service settings.

### Resolve method
Every factory class must implement the `resolve` method. As you can see,
it provides a single argument, `params: any[]`, which actually contains
all parameters and services that should be injected through constructor.
In the case of the upper example, `params` would be something like `['value of param']`.
Diosaur automatically builds this array with correct order of arguments,
it's your job to inject it in your service.

:::warning
Avoid services which have Diosaur and non-diosaur injected constructor arguments,
Diosaur only knows about the decorated ones, the order will be wrong if there's
some he's not aware of.
:::

## Async class factories
You can also set async class factories easily by setting the resolve method
as `async` or returning a Promise.
```typescript
@Factory(MyService, { /* other settings like tag, scope... */ })
class MyFactory implements IFactory {
    async resolve(params: any[]) {
        return new MyService(...params);
    }
}
```

## anonymous factories
You can register some anonymous factories with the `register` method to avoid creating a class.
The first argument is the service identifier, the second is either a function that will generate
the service or the service itself, the third is the service configuration.

```typescript
import { register, getContainer } from 'diosaur';

register('a', 'a'); // register a primitive as service
register('b', () => 'b', { scope: 'renewable', tag: 'B' }); // register a primitive as service and custom config
register('c', { key: 'value' }); // register an object
register('d', new Something()); // Simple object creation
register('e', (args: any[]) => new SomethingElse(...args)); // object creation with injection

// These two do the same
register('a', 'a'); // Internally converted to () => 'a'
register('a', () => 'a');
```

## Async anonymous factories
You can also register async anonymous factories easily using `registerAsync`.
```typescript
import{ registerAsync } from 'diosaur';

registerAsync('d', new Promise((resolve) => {
    setTimeout(() => {
        resolve('D');
    }, 100);
}));
```

## A note on async factories
All services registered through async factories **must** be scoped as `singleton`. That's
because once registered, calling the `await getContainer()` will actually create those
services and keep them in the service registry for future usage.

If we didn't do it, when a service would require a dependency on a service registered
through an async factory we couldn't resolve it, but would resolve a Promise. That could work,
but then how would we inject constructor dependencies, and you would have to `await` a promise
to receive your service.

That's why all async services must be `singleton` scoped.

## Registering services after initialization
It is possible to register dynamic services and parameters after retrieving the container.
```typescript
import { getContainer, register, refreshContainer } from 'diosaur';

let container = await getContainer();
register('a', () => 'a');

container.get('a'); // Will throw an error

container = await refreshContainer();

container.get('a'); // a
```
:::danger
Note that refreshing the container will completely wipe any existing scope
along with all cached instance
:::