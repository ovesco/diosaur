import 'reflect-metadata';
import { getContainer } from "../src/index";
import { IContainer } from "../src/Container";
import { Service, InjectAll, Inject } from '../src/Decorators';

abstract class SS {

    public readonly sym = Symbol();

    getName() {
        return this.constructor.name;
    }
}

@Service({ identifier: 'AS', tag: '1' })
class SS1 extends SS {}

@Service({ identifier: 'AS', tag: '2' })
class SS2 extends SS {}

@Service({ identifier: 'AS', tag: '3' })
class SS3 extends SS {}

@Service()
class DepsAllService {
    constructor(@InjectAll('AS') public readonly as: SS[]) {}
}

@Service()
class DepsService {
    constructor(@Inject({ identifier: 'AS', tag: '3' }) public readonly s: SS) {}
}

describe('Diosaur factory registration', () => {

    // @ts-ignore
    let container: IContainer = null;
    it('Should support retrieving container', async() => {
        container = await getContainer();
    });

    it('Should support injecting a service through constructor', () => {
        expect(container.get(DepsService).s.getName()).toBe('SS3');
    });

    it('Should support injecting multiple services through constructor', () => {
        const allServices = container.get(DepsAllService).as;
        expect(allServices.length).toBe(3);
        [SS1, SS2, SS3].forEach((proto, i) => expect(Object.getPrototypeOf(allServices[i]).constructor).toBe(proto));
    });
});
