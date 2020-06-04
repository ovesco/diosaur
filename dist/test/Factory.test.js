var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
import { getContainer, register, registerAsync, refreshContainer } from "../src/index";
import { Factory } from '../src/Decorators';
class A1 {
}
class A2 {
}
let F1 = class F1 {
    resolve() {
        return new A1();
    }
};
F1 = __decorate([
    Factory(A1)
], F1);
let AsyncF1 = class AsyncF1 {
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            return new A1();
        });
    }
};
AsyncF1 = __decorate([
    Factory(A1, { tag: 'async' })
], AsyncF1);
let F2 = class F2 {
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            return new A2();
        });
    }
};
F2 = __decorate([
    Factory(A2)
], F2);
describe('Diosaur factory registration', () => {
    // @ts-ignore
    let container = null;
    it('Should support retrieving container', () => __awaiter(this, void 0, void 0, function* () {
        container = yield getContainer();
    }));
    it('Should support registering sync factories', () => {
        expect(container.get(A1)).toBeInstanceOf(A1);
    });
    it('Should support registering async factories', () => {
        expect(container.get(A2)).toBeInstanceOf(A2);
        expect(container.get(A1, 'async')).toBeInstanceOf(A1);
    });
    it('Should support registering anonymous factories', () => __awaiter(this, void 0, void 0, function* () {
        register('abracadabra', () => 'a');
        register('b', () => () => 'b');
        register('c', { yo: 'yo' });
        registerAsync('d', new Promise((resolve) => {
            setTimeout(() => {
                resolve('D');
            }, 100);
        }));
        container = yield refreshContainer();
        expect(container.get('abracadabra')).toBe('a');
        // @ts-ignore
        expect(container.get('b')()).toBe('b');
        // @ts-ignore
        expect(container.get('c').yo).toBe('yo');
        expect(container.get('d')).toBe('D');
    }));
});
