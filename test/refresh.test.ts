import 'reflect-metadata';
import { getContainer, register, registerAsync, refreshContainer } from "../src/index";
import { IContainer } from "../src/Container";
import { Service, Inject } from '../src/Decorators';

@Service({ scoping: 'singleton' })
class Singleton {
    public readonly sym = Symbol();
}

@Service({ scoping: 'renewable' })
class Renewable {
    public readonly sym = Symbol();
}

@Service({ scoping: 'custom', customScopes: ['scope1', 'scope2'] })
class Custom {
    public readonly sym = Symbol();
}

@Service()
class Refreshed {

    @Inject({ refresh: true })
    public readonly singleton: Singleton;

    @Inject({ refresh: true })
    public readonly renewable: Renewable;

    @Inject({ refresh: true })
    public readonly custom: Custom;
}

@Service()
class NotRefreshed {

    @Inject({ refresh: false })
    public readonly singleton: Singleton;

    @Inject({ refresh: false })
    public readonly renewable: Renewable;

    @Inject({ refresh: false })
    public readonly custom: Custom;
}

describe('Diosaur factory registration', () => {

    // @ts-ignore
    let container: IContainer = null;
    it('Should support retrieving container', async() => {
        container = await getContainer();
    });

    it('Should support unrefreshed injection correctly', () => {
        const unrefreshed = container.get(NotRefreshed);

        expect(unrefreshed.singleton.sym).toBe(unrefreshed.singleton.sym);
        expect(unrefreshed.renewable.sym).toBe(unrefreshed.renewable.sym);
        expect(unrefreshed.custom.sym).toBe(unrefreshed.custom.sym);
        
        const preScopeInstance = unrefreshed.custom.sym;
        container.enterScope('scope1');
        const scope1Instance = unrefreshed.custom.sym;
        container.enterScope('scope2');
        const scope12Instance = unrefreshed.custom.sym;
        container.exitScope('scope1');
        const scope2Instance = unrefreshed.custom.sym;
        container.exitScope('scope2');
        const postScopeInstance = unrefreshed.custom.sym;

        [scope1Instance, scope12Instance, scope2Instance, postScopeInstance].forEach((instance) => expect(preScopeInstance).toBe(instance));
    });

    it('Should support refreshed injection correctly', () => {
        const refreshed = container.get(Refreshed);

        expect(refreshed.singleton.sym).toBe(refreshed.singleton.sym);
        expect(refreshed.renewable.sym).not.toBe(refreshed.renewable.sym);
        expect(refreshed.custom.sym).not.toBe(refreshed.custom.sym);

        const preScopeInstance = refreshed.custom.sym;
        container.enterScope('scope1');
        const scope1Instance = refreshed.custom.sym;
        container.enterScope('scope2');
        const scope12Instance = refreshed.custom.sym;
        container.exitScope('scope1');
        const scope2Instance = refreshed.custom.sym;
        container.exitScope('scope2');
        const postScopeInstance = refreshed.custom.sym;

        expect(preScopeInstance).not.toBe(scope1Instance);
        expect(scope1Instance).toBe(scope12Instance);
        expect(scope1Instance).toBe(scope2Instance);
        expect(scope2Instance).not.toBe(postScopeInstance);
        expect(preScopeInstance).not.toBe(postScopeInstance);
    });
});
