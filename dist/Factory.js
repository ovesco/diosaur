"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BasicFactory {
    constructor(targetType) {
        this.targetType = targetType;
    }
    resolve(data) {
        return Reflect.construct(this.targetType, data);
    }
}
exports.BasicFactory = BasicFactory;
class FunctionFactory {
    constructor(serviceMaker) {
        this.serviceMaker = serviceMaker;
    }
    resolve(data) {
        return this.serviceMaker(data);
    }
}
exports.FunctionFactory = FunctionFactory;
class AsyncFunctionFactory {
    constructor(serviceMaker) {
        this.serviceMaker = serviceMaker;
    }
    resolve(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.serviceMaker(data);
        });
    }
}
exports.AsyncFunctionFactory = AsyncFunctionFactory;
