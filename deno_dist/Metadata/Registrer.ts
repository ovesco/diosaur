import { ParameterBag, Constructor, ServiceClassIdentifier, ServiceIdentifier } from "../Types.ts";
import { ServiceConfig, InjectConfig } from "../Decorators.ts";
import { ConstructorInjectAllService, AttributeInjectAllService, BaseInjectAllService } from "./AllServiceInjection.ts";
import { ConstructorInjectedParameter, AttributeInjectedParameter, BaseInjectedParameter } from "./ParameterInjection.ts";
import { ConstructorInjectedService, AttributeInjectedService, BaseInjectedService } from "./ServiceInjection.ts";
import RegisteredFactory from "./RegisteredFactory.ts";
import { BasicFactory } from "../Factory.ts";
import IFactory from "../IFactory.ts";
import { IContainer } from "../Container.ts";
import { NotBuiltContainerError } from "../Errors.ts";
import ContainerBuilder from "../Compilation/ContainerBuilder.ts";

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

    static async build() {
        const builder = new ContainerBuilder(
            this.factories,
            this.injections,
            this.injectedParameters,
            this.allInjections,
            this.parameters);
        Registrer._container = await builder.buildContainer();
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

    static registerAttributeAllService(service: ServiceClassIdentifier, identifier: ServiceIdentifier, paramKey: string | symbol) {
        Registrer.allInjections.push(new AttributeInjectAllService(service, identifier, paramKey));
    }

    static registerConstructorAllService(service: ServiceClassIdentifier, identifier: ServiceIdentifier, index: number) {
        Registrer.allInjections.push(new ConstructorInjectAllService(service, identifier, index));
    }
}

export default Registrer;