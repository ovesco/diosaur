<div style="display:flex;align-items:center;flex-direction:column;">
    <img src="./assets/diosaur-logo.png" style="max-width:16rem">
    <h1 style="margin:2rem 0 0 0">Diosaur</h1>
    <h3 style="margin-bottom:0">Dependency Injection for Node and Deno</h3>
    <h4>No dependencies other than <code>reflect-metadata</code></h4>
    <div style="display:flex;justify-content:center;margin-bottom:2rem">
        <a href="https://github.com/ovesco/diosaur">Github</a>
    </div>
</div>

<hr/>

Diosaur is a library which allows you to declare objects and services as
dependencies to other objects and services and so on, building your application
with ease while it takes care of managing them for you.

::: warning
This library requires typescript to work as it is based on Annotations.
:::

```typescript
import 'reflect-metadata';
import { Service, Parameter, Inject, setParameter, getContainer } from 'diosaur';

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