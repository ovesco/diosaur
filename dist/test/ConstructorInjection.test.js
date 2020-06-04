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
import { getContainer } from "../src/index";
import { Service, InjectAll, Inject } from '../src/Decorators';
class SS {
    constructor() {
        this.sym = Symbol();
    }
    getName() {
        return this.constructor.name;
    }
}
let SS1 = class SS1 extends SS {
};
SS1 = __decorate([
    Service({ identifier: 'AS', tag: '1' })
], SS1);
let SS2 = class SS2 extends SS {
};
SS2 = __decorate([
    Service({ identifier: 'AS', tag: '2' })
], SS2);
let SS3 = class SS3 extends SS {
};
SS3 = __decorate([
    Service({ identifier: 'AS', tag: '3' })
], SS3);
let DepsAllService = class DepsAllService {
    constructor(as) {
        this.as = as;
    }
};
DepsAllService = __decorate([
    Service(),
    __param(0, InjectAll('AS')),
    __metadata("design:paramtypes", [Array])
], DepsAllService);
let DepsService = class DepsService {
    constructor(s) {
        this.s = s;
    }
};
DepsService = __decorate([
    Service(),
    __param(0, Inject({ identifier: 'AS', tag: '3' })),
    __metadata("design:paramtypes", [SS])
], DepsService);
describe('Diosaur factory registration', () => {
    // @ts-ignore
    let container = null;
    it('Should support retrieving container', () => __awaiter(this, void 0, void 0, function* () {
        container = yield getContainer();
    }));
    it('Should support injecting a service through constructor', () => {
        expect(container.get(DepsService).s.getName()).toBe('SS3');
    });
    it('Should support injecting multiple services through constructor', () => {
        const allServices = container.get(DepsAllService).as;
        expect(allServices.length).toBe(3);
        [SS1, SS2, SS3].forEach((proto, i) => expect(Object.getPrototypeOf(allServices[i]).constructor).toBe(proto));
    });
});
