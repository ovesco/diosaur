# Basic usage
Diosaur provides a simple yet efficient dependency injection container solution.
It allows you to declare *services* which can be injected in other *services* and so on.

## Service
A service in Diosaur can be virtually anything, an object, a function, a primitive...
It's the way you use that makes it a service in itself. Diosaur allows you to reference it
and then inject it in other services later.

### Class service
Diosaur allows you to define a `class` as service by decorating it with the `@Service` decorator.
```typescript
@Service()
class MyService {
    // ...
}
```

What did we actually do here? By decorating the `MyService` class with the `@Service` decorator, we told Diosaur that
this class is a service and its lifecycle must be handled. It could be a dependency and be
injected in other services as well as require some dependencies as we'll now.

### Injecting dependencies
Your services will probably require other services to work, for example a database connection,
a mail services or other. As such, you can inject some services in other services by doing the following.
```typescript
@Service()
class OtherService {

    // Injecting through attribute
    @Inject()
    private myService: MyService;

    // Injecting through constructor
    constructor(@Inject() myService: MyService) {}
}
```

Now, when we'll ask Diosaur to retrieve the `OtherService` for us, it's `myService` attribute will automatically
be resolved to the correct instance of `MyService`.

:::warning Injecting services through constructor
Injecting dependencies through constructor is an experimental feature which is documented
in a dedicated chapter.
:::

## Parameters
Diosaur can also register and inject `Parameters`. Those are actually static values that won't
change throughout the life of your program, usually they only contain strings or primitive values like
database credentials. You can register a parameter by doing the following:
```typescript
import { setParameter, Paramerer } from 'diosaur';

Diosaur.set('paramKey', 'value');
```

And you can inject it by doing the following:
```typescript
class MyService {

    @Parameter('paramKey')
    private param: string;

    // Or directly inject it through constructor
    constructor(@Parameter('paramKey') private param: string) {}
}
```

## Retrieving a service
Now that all of your services class are all setup we can ask Diosaur
to build itself and resolve our services.
```typescript
import { getContainer } from 'diosaur';

const container = await getContainer();
const myService = container.get(MyService); // Instance of MyService
const myParam = container.get('paramKey'); // value
```