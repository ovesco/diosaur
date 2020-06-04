import { IContainer, getContainer, Service, Inject } from "./src/index";
import 'reflect-metadata';

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

    public readonly id = Math.floor(Math.random() * 1000000);
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


(async() => {
    const container = await getContainer();

    const refreshed = container.get(Refreshed);

    const preScopeInstance = refreshed.custom;
    container.enterScope('scope1');
    const scope1Instance = refreshed.custom;
    container.enterScope('scope2');
    const scope12Instance = refreshed.custom;
    container.exitScope('scope1');
    const scope2Instance = refreshed.custom;
    container.exitScope('scope2');
    const postScopeInstance = refreshed.custom;

    console.log(preScopeInstance.sym !== scope1Instance.sym);
})();