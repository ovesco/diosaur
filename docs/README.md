# Diosaur

Diosaur (which stands for DI-osaur, such a good one tho), is a simple and straightforward dependency
injection library for Node and Deno.

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