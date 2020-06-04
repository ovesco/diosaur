var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
import { Service, getContainer, setParameter, Inject } from "../src/index";
import { Container } from "../src/Container";
import { SCOPES, InjectAll, Parameter } from '../src/Decorators';
describe('Diosaur service registration', () => {
    let A = class A {
    };
    A = __decorate([
        Service()
    ], A);
    let B = class B {
    };
    B = __decorate([
        Service()
    ], B);
    let C = class C {
    };
    C = __decorate([
        Service()
    ], C);
    class S {
        getName() {
            return this.constructor.name;
        }
    }
    let S1 = class S1 extends S {
    };
    S1 = __decorate([
        Service({ identifier: S, tag: 's1' })
    ], S1);
    let S2 = class S2 extends S {
    };
    S2 = __decorate([
        Service({ identifier: S, tag: 's2' })
    ], S2);
    let S3 = class S3 extends S {
    };
    S3 = __decorate([
        Service({ identifier: S, tag: 's3' })
    ], S3);
    setParameter('yo', 'yoyo');
    setParameter('sid', 's3');
    let dep1 = class dep1 {
        constructor(sid) {
            this.sid = sid;
        }
    };
    __decorate([
        Inject({ tag: 's2' }),
        __metadata("design:type", S)
    ], dep1.prototype, "s", void 0);
    __decorate([
        InjectAll(S),
        __metadata("design:type", Array)
    ], dep1.prototype, "allS", void 0);
    __decorate([
        Parameter('yo'),
        __metadata("design:type", String)
    ], dep1.prototype, "param", void 0);
    dep1 = __decorate([
        Service(),
        __param(0, Parameter('sid')),
        __metadata("design:paramtypes", [String])
    ], dep1);
    let dep2 = class dep2 {
    };
    __decorate([
        Inject({ tag: '@sid' }),
        __metadata("design:type", S)
    ], dep2.prototype, "s", void 0);
    dep2 = __decorate([
        Service()
    ], dep2);
    let Random = class Random {
        constructor() {
            this.n = Symbol(Math.ceil(Math.random() * 1000));
        }
    };
    Random = __decorate([
        Service({ scoping: SCOPES.newable })
    ], Random);
    let R1 = class R1 {
    };
    __decorate([
        Inject({ refresh: true }),
        __metadata("design:type", Random)
    ], R1.prototype, "r", void 0);
    R1 = __decorate([
        Service()
    ], R1);
    let R2 = class R2 {
    };
    __decorate([
        Inject({ refresh: false }),
        __metadata("design:type", Random)
    ], R2.prototype, "r", void 0);
    R2 = __decorate([
        Service()
    ], R2);
    class subScoped {
        constructor() {
            this.s = Symbol();
        }
    }
    let Scoped1 = class Scoped1 extends subScoped {
    };
    Scoped1 = __decorate([
        Service({
            scoping: SCOPES.custom,
            customScopes: ['scope1']
        })
    ], Scoped1);
    let Scoped2 = class Scoped2 extends subScoped {
    };
    Scoped2 = __decorate([
        Service({
            scoping: SCOPES.custom,
            customScopes: ['scope2']
        })
    ], Scoped2);
    let ScopedAll = class ScopedAll extends subScoped {
    };
    ScopedAll = __decorate([
        Service({
            scoping: SCOPES.custom,
            customScopes: ['scope1', 'scope2']
        })
    ], ScopedAll);
    let RScoped = class RScoped {
    };
    __decorate([
        Inject({ refresh: true }),
        __metadata("design:type", Scoped1)
    ], RScoped.prototype, "s1", void 0);
    __decorate([
        Inject({ refresh: true }),
        __metadata("design:type", Scoped2)
    ], RScoped.prototype, "s2", void 0);
    __decorate([
        Inject({ refresh: true }),
        __metadata("design:type", ScopedAll)
    ], RScoped.prototype, "s12", void 0);
    RScoped = __decorate([
        Service()
    ], RScoped);
    // @ts-ignore
    let container = null;
    it('Should support retrieving the container', () => __awaiter(this, void 0, void 0, function* () {
        container = yield getContainer();
        expect(container).toBeInstanceOf(Container);
    }));
    it('Should support retrieving services', () => {
        expect(container.get(A)).toBeInstanceOf(A);
        expect(container.get(B)).toBeInstanceOf(B);
        expect(container.get(C)).toBeInstanceOf(C);
    });
    it('Should support retrieving a parameter', () => {
        expect(container.getParameter('yo')).toBe('yoyo');
    });
    it('Should support injecting a parameter through constructor', () => {
        expect(container.get(dep1).sid).toBe('s3');
    });
    it('Should support retrieving a tagged service', () => {
        expect(container.get(S, 's2')).toBeInstanceOf(S2);
    });
    it('Should support injecting a parameter', () => {
        expect(container.get(dep1).param).toBe('yoyo');
        expect(container.get(dep1).param).toBe(container.getParameter('yo'));
    });
    it('Should support retrieving all services identified by an identifier', () => {
        const sservices = container.getAll(S);
        expect(sservices.length).toBe(3);
        [S1, S2, S3].forEach((cls, i) => expect(sservices[i]).toBeInstanceOf(cls));
    });
    it('Should support injecting all services with given identifier', () => {
        const sservices = container.get(dep1).allS;
        expect(sservices.length).toBe(3);
        [S1, S2, S3].forEach((cls, i) => expect(sservices[i]).toBeInstanceOf(cls));
    });
    it('Should allow services to retrieve their dependencies', () => {
        expect(container.get(dep1).s.getName()).toBe('S2');
    });
    it('Should allow services to tag their dependencies based on parameter', () => {
        expect(container.get(dep2).s.getName()).toBe('S3');
    });
    it('Should support service renewable scoping with constant refresh', () => {
        const rs = container.get(R1);
        const s1 = rs.r.n;
        const s2 = rs.r.n;
        expect(s1).not.toBe(s2);
    });
    it('Should support service renewable scoping with no refresh', () => {
        const rs = container.get(R2);
        const s1 = rs.r.n;
        const s2 = rs.r.n;
        expect(s1).toBe(s2);
    });
    it('Should support custom scopes with no scope set', () => {
        const rscoped = container.get(RScoped);
        expect(rscoped.s1.s).not.toBe(rscoped.s1.s);
    });
    it('Should support custom scope', () => {
        const rscoped = container.get(RScoped);
        container.enterScope('scope1');
        expect(rscoped.s1.s).toBe(rscoped.s1.s);
        container.exitScope('scope1');
        expect(rscoped.s1.s).not.toBe(rscoped.s1.s);
    });
    it('Should support multiple custom scopes', () => {
        const rscoped = container.get(RScoped);
        container.enterScope('scope1');
        const sScope1 = rscoped.s12.s;
        expect(sScope1).toBe(rscoped.s12.s);
        container.enterScope('scope2');
        expect(sScope1).toBe(rscoped.s12.s);
        container.exitScope('scope1');
        expect(sScope1).toBe(rscoped.s12.s);
        container.exitScope('scope2');
        expect(sScope1).not.toBe(rscoped.s12.s);
    });
});
