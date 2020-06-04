import { ParameterBag, Constructor, ServiceClassIdentifier, ServiceIdentifier } from "../Types.ts";
import { ServiceConfig, InjectConfig } from "../Decorators.ts";
import { AttributeInjectAllService, BaseInjectAllService, ConstructorInjectAllService } from "./AllServiceInjection.ts";
import { AttributeInjectedParameter, BaseInjectedParameter, ConstructorInjectedParameter } from "./ParameterInjection.ts";
import { AttributeInjectedService, BaseInjectedService, ConstructorInjectedService } from "./ServiceInjection.ts";
import RegisteredFactory from "./RegisteredFactory.ts";
import { BasicFactory } from "../Factory.ts";
import IFactory from "../IFactory.ts";
import { IContainer, Container } from "../Container.ts";
import { NotBuiltContainerError } from "../Errors.ts";
import ServiceResolver from "../Compilation/ServiceResolver.ts";
class Registrer {
    private static parameters: ParameterBag = new Map();
    private static factories: Array<RegisteredFactory> = [];
    private static injections: Array<BaseInjectedService> = [];
    private static allInjections: Array<BaseInjectAllService> = [];
    private static injectedParameters: Array<BaseInjectedParameter> = [];
    private static _container: IContainer | null = null;
    static getContainer(): IContainer {
        if (!Registrer._container) {
            throw new NotBuiltContainerError();
        }
        return Registrer._container;
    }
    static async build(refresh: boolean = false) {
        if (Registrer._container && !refresh)
            return Registrer._container;
        const resolver = new ServiceResolver(this.factories, this.injections, this.injectedParameters, this.allInjections, this.parameters);
        await resolver.warmup();
        Registrer._container = new Container(resolver);
        return Registrer._container;
    }
    static setParameter(key: string | symbol | Constructor, value: any) {
        Registrer.parameters.set(key, value);
    }
    static registerService(targetType: Constructor, config: ServiceConfig) {
        this.registerFactory(new BasicFactory(targetType), targetType, config);
    }
    static registerFactory(factory: IFactory, targetType: ServiceClassIdentifier, config: ServiceConfig) {
        Registrer.factories.push(new RegisteredFactory(factory, targetType, config));
    }
    static registerAttributeInject(service: ServiceClassIdentifier, key: string | symbol, config: InjectConfig) {
        Registrer.injections.push(new AttributeInjectedService(service, key, config));
    }
    static registerConstructorInject(service: ServiceClassIdentifier, index: number, config: InjectConfig) {
        Registrer.injections.push(new ConstructorInjectedService(service, index, config));
    }
    static registerAttributeParameter(service: ServiceClassIdentifier, key: string | symbol, paramKey: string | symbol | Constructor) {
        Registrer.injectedParameters.push(new AttributeInjectedParameter(service, key, paramKey));
    }
    static registerConstructorParameter(service: ServiceClassIdentifier, index: number, paramKey: string | symbol | Constructor) {
        Registrer.injectedParameters.push(new ConstructorInjectedParameter(service, index, paramKey));
    }
    static registerAttributeAllService(service: ServiceClassIdentifier, identifier: ServiceIdentifier, paramKey: string | symbol, refresh: boolean) {
        Registrer.allInjections.push(new AttributeInjectAllService(service, identifier, paramKey, refresh));
    }
    static registerConstructorAllService(service: ServiceClassIdentifier, identifier: ServiceIdentifier, index: number, refresh: boolean) {
        Registrer.allInjections.push(new ConstructorInjectAllService(service, identifier, index, refresh));
    }
}
export default Registrer;
