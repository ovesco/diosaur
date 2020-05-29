import 'https://raw.githubusercontent.com/rbuckton/reflect-metadata/master/Reflect.js';
import { Service, Inject, getContainer } from './src/index.ts';

console.log(Deno.version);

@Service()
class A {
    private s: string = 'swag';
}

@Service()
class B {

    @Inject()
    public a: A;
}

getContainer().then((container) => {
    console.log(container.get(B).a);
});