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
import { getContainer, Service, Inject } from "./src/index";
import 'reflect-metadata';
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
        this.id = Math.floor(Math.random() * 1000000);
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
(() => __awaiter(this, void 0, void 0, function* () {
    const container = yield getContainer();
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
}))();
