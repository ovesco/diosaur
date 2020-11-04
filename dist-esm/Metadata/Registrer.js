var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AttributeInjectAllService, ConstructorInjectAllService } from "./AllServiceInjection";
import { AttributeInjectedParameter, ConstructorInjectedParameter } from "./ParameterInjection";
import { AttributeInjectedService, ConstructorInjectedService } from "./ServiceInjection";
import RegisteredFactory from "./RegisteredFactory";
import { BasicFactory } from "../Factory";
import { Container } from "../Container";
import { NotBuiltContainerError } from "../Errors";
import ServiceResolver from "../Compilation/ServiceResolver";
class Registrer {
    static getContainer() {
        if (!Registrer._container) {
            throw new NotBuiltContainerError();
        }
        return Registrer._container;
    }
    static build(refresh = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Registrer._container && !refresh)
                return Registrer._container;
            const resolver = new ServiceResolver(this.factories, this.injections, this.injectedParameters, this.allInjections, this.parameters);
            yield resolver.warmup();
            Registrer._container = new Container(resolver);
            return Registrer._container;
        });
    }
    static setParameter(key, value) {
        Registrer.parameters.set(key, value);
    }
    static registerService(targetType, config) {
        this.registerFactory(new BasicFactory(targetType), targetType, config);
    }
    static registerFactory(factory, targetType, config) {
        Registrer.factories.push(new RegisteredFactory(factory, targetType, config));
    }
    static registerAttributeInject(service, key, config) {
        Registrer.injections.push(new AttributeInjectedService(service, key, config));
    }
    static registerConstructorInject(service, index, config) {
        Registrer.injections.push(new ConstructorInjectedService(service, index, config));
    }
    static registerAttributeParameter(service, key, paramKey) {
        Registrer.injectedParameters.push(new AttributeInjectedParameter(service, key, paramKey));
    }
    static registerConstructorParameter(service, index, paramKey) {
        Registrer.injectedParameters.push(new ConstructorInjectedParameter(service, index, paramKey));
    }
    static registerAttributeAllService(service, identifier, paramKey, refresh) {
        Registrer.allInjections.push(new AttributeInjectAllService(service, identifier, paramKey, refresh));
    }
    static registerConstructorAllService(service, identifier, index, refresh) {
        Registrer.allInjections.push(new ConstructorInjectAllService(service, identifier, index, refresh));
    }
}
Registrer.parameters = new Map();
Registrer.factories = [];
Registrer.injections = [];
Registrer.allInjections = [];
Registrer.injectedParameters = [];
Registrer._container = null;
export default Registrer;
//# sourceMappingURL=Registrer.js.map