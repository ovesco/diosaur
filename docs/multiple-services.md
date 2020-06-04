# Injecting multiple services
We saw previously that we could tag our services, as such some of them
might share the same *service identifier*. We can inject all services
that share a common identifier using the `@InjectAll` decorator.

Taking the example from previous page:
```typescript
const TYPES = {
    cache: Symbol('cache')
};

@Service({ identifier: TYPES.cache, tag: 'redis' })
class RedisCache implements ICache { /* ... */ }

@Service({ identifier: TYPES.cache, tag: 'local' })
class LocalCache implements ICache { /* ... */ }
```

We can inject them all in another service easily:
```typescript
@Service()
class MyService {

    @InjectAll(TYPES.cache)
    private caches: ICache[];

    // Or through constructor
    constructor(@InjectAll(TYPES.cache) caches: ICache[]) {}
}
```

Resolving them manually can be done with:
```typescript
container.getAll(TYPES.cache);
```