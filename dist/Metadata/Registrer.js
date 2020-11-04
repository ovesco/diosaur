"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AllServiceInjection_1 = require("./AllServiceInjection");
const ParameterInjection_1 = require("./ParameterInjection");
const ServiceInjection_1 = require("./ServiceInjection");
const RegisteredFactory_1 = __importDefault(require("./RegisteredFactory"));
const Factory_1 = require("../Factory");
const Container_1 = require("../Container");
const Errors_1 = require("../Errors");
const ServiceResolver_1 = __importDefault(require("../Compilation/ServiceResolver"));
class Registrer {
    static getContainer() {
        if (!Registrer._container) {
            throw new Errors_1.NotBuiltContainerError();
        }
        return Registrer._container;
    }
    static build(refresh = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Registrer._container && !refresh)
                return Registrer._container;
            const resolver = new ServiceResolver_1.default(this.factories, this.injections, this.injectedParameters, this.allInjections, this.parameters);
            yield resolver.warmup();
            Registrer._container = new Container_1.Container(resolver);
            return Registrer._container;
        });
    }
    static setParameter(key, value) {
        Registrer.parameters.set(key, value);
    }
    static registerService(targetType, config) {
        this.registerFactory(new Factory_1.BasicFactory(targetType), targetType, config);
    }
    static registerFactory(factory, targetType, config) {
        Registrer.factories.push(new RegisteredFactory_1.default(factory, targetType, config));
    }
    static registerAttributeInject(service, key, config) {
        Registrer.injections.push(new ServiceInjection_1.AttributeInjectedService(service, key, config));
    }
    static registerConstructorInject(service, index, config) {
        Registrer.injections.push(new ServiceInjection_1.ConstructorInjectedService(service, index, config));
    }
    static registerAttributeParameter(service, key, paramKey) {
        Registrer.injectedParameters.push(new ParameterInjection_1.AttributeInjectedParameter(service, key, paramKey));
    }
    static registerConstructorParameter(service, index, paramKey) {
        Registrer.injectedParameters.push(new ParameterInjection_1.ConstructorInjectedParameter(service, index, paramKey));
    }
    static registerAttributeAllService(service, identifier, paramKey, refresh) {
        Registrer.allInjections.push(new AllServiceInjection_1.AttributeInjectAllService(service, identifier, paramKey, refresh));
    }
    static registerConstructorAllService(service, identifier, index, refresh) {
        Registrer.allInjections.push(new AllServiceInjection_1.ConstructorInjectAllService(service, identifier, index, refresh));
    }
}
Registrer.parameters = new Map();
Registrer.factories = [];
Registrer.injections = [];
Registrer.allInjections = [];
Registrer.injectedParameters = [];
Registrer._container = null;
exports.default = Registrer;
//# sourceMappingURL=Registrer.js.map