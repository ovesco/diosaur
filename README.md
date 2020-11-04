# Diosaur
#### A small dependency injection for Node and Deno.

Diosaur is a small dependency injection solution written in Typescript for Deno and node which aims at making you write the minimum
of code, avoiding obvious bindings and other repetitive stuff. It internally depends on `reflect-metadata` to guess
the maximum indications out of your code, but still allows you for finer definition of your services.

## Please note that you require Typescript to use this library, as it makes usage of Annotations to work.

## Example
```typescript
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

## Documentation
All documentation for the library can be found here.
[Documentation](https://ovesco.github.io/diosaur/)