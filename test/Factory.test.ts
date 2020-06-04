import 'reflect-metadata';
import { getContainer, register, registerAsync, refreshContainer } from "../src/index";
import { IContainer } from "../src/Container";
import { Factory } from '../src/Decorators';
import IFactory from '../src/IFactory';

class A1 {}

class A2 {}

@Factory(A1)
class F1 implements IFactory {
    resolve() {
        return new A1();
    }
}

@Factory(A1, { tag: 'async' })
class AsyncF1 implements IFactory {
    async resolve() {
        return new A1();
    }
}

@Factory(A2)
class F2 implements IFactory {
    async resolve() {
        return new A2();
    }
}



describe('Diosaur factory registration', () => {

    // @ts-ignore
    let container: IContainer = null;
    it('Should support retrieving container', async() => {
        container = await getContainer();
    });

    it('Should support registering sync factories', () => {
        expect(container.get(A1)).toBeInstanceOf(A1);
    });

    it('Should support registering async factories', () => {
        expect(container.get(A2)).toBeInstanceOf(A2);
        expect(container.get(A1, 'async')).toBeInstanceOf(A1);
    });

    it('Should support registering anonymous factories', async () => {
        register('abracadabra', () => 'a');
        register('b', () => () => 'b');
        register('c', { yo: 'yo' });
        registerAsync('d', new Promise((resolve) => {
            setTimeout(() => {
                resolve('D');
            }, 100);
        }));
        container = await refreshContainer();
        expect(container.get('abracadabra')).toBe('a');
        // @ts-ignore
        expect(container.get('b')()).toBe('b');
        // @ts-ignore
        expect(container.get('c').yo).toBe('yo');
        expect(container.get('d')).toBe('D');
    });
});
