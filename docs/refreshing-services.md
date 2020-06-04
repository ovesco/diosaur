# Refreshing services

:::warning
This functionnality is still in testing phase.
:::

When Diosaur resolves a dependency for a service, it will first resolve the dependency's dependencies,
instanciate it, and then inject it into your service. This is an expected behavior, but sometimes you
need some refreshed instances.

## Singleton with non-singleton dependencies
Let's take a singleton service which has a renewable dependency. Once the singleton is resolved,
it's dependencies are built and injected in it, which means the renewable service is created once for
it and injected.

> The singleton will only know one single instance of a renewable service

Same for custom scoped dependencies, whenever the singleton is resolved for the first time, its dependencies
are resolved (if between scopes might be an unwanted instance) and never refreshed.

## Refreshing dependencies
If you need to refresh your service dependencies, you can use the custom `refresh` parameter of the `Inject` or `InjectAll`
decorators.
```typescript
@Service({ scoping: 'renewable' })
class Renewable {
    public readonly sym = Symbol();
}

@Service()
class MyService {

    @Inject({ refresh: true })
    private renewable: Renewable;

    constructor() {
        console.log(this.renewable.sym === this.renewable.sym); // false
    }
}
```

## Internals
In the background we're making use of [lazy proxies](https://guigui.ch/articles/typescript-lazy-proxy.html)
to simulate this behavior and keep an expected API.

The attribute where you're supposed to find your service is replaced with a proxy
that will load the actual service instance every time it is accessed. Doing `this.renewable.sym` from the previous
example is actually doing
```typescript
(container.get(Renewable)).sym
```