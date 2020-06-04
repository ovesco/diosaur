var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'reflect-metadata';
import { getContainer } from "../src/index";
import { Service, Inject } from '../src/Decorators';
let Singleton = class Singleton {
    constructor() {
        this.sym = Symbol();
    }
};
Singleton = __decorate([
    Service({ scoping: 'singleton' })
], Singleton);
let Renewable = class Renewable {
    constructor() {
        this.sym = Symbol();
    }
};
Renewable = __decorate([
    Service({ scoping: 'renewable' })
], Renewable);
let Custom = class Custom {
    constructor() {
        this.sym = Symbol();
    }
};
Custom = __decorate([
    Service({ scoping: 'custom', customScopes: ['scope1', 'scope2'] })
], Custom);
let Refreshed = class Refreshed {
};
__decorate([
    Inject({ refresh: true }),
    __metadata("design:type", Singleton)
], Refreshed.prototype, "singleton", void 0);
__decorate([
    Inject({ refresh: true }),
    __metadata("design:type", Renewable)
], Refreshed.prototype, "renewable", void 0);
__decorate([
    Inject({ refresh: true }),
    __metadata("design:type", Custom)
], Refreshed.prototype, "custom", void 0);
Refreshed = __decorate([
    Service()
], Refreshed);
let NotRefreshed = class NotRefreshed {
};
__decorate([
    Inject({ refresh: false }),
    __metadata("design:type", Singleton)
], NotRefreshed.prototype, "singleton", void 0);
__decorate([
    Inject({ refresh: false }),
    __metadata("design:type", Renewable)
], NotRefreshed.prototype, "renewable", void 0);
__decorate([
    Inject({ refresh: false }),
    __metadata("design:type", Custom)
], NotRefreshed.prototype, "custom", void 0);
NotRefreshed = __decorate([
    Service()
], NotRefreshed);
describe('Diosaur factory registration', () => {
    // @ts-ignore
    let container = null;
    it('Should support retrieving container', () => __awaiter(this, void 0, void 0, function* () {
        container = yield getContainer();
    }));
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
