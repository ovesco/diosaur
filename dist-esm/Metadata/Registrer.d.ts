import { Constructor, ServiceClassIdentifier, ServiceIdentifier } from "../Types";
import { ServiceConfig, InjectConfig } from "../Decorators";
import IFactory from "../IFactory";
import { IContainer } from "../Container";
declare class Registrer {
    private static parameters;
    private static factories;
    private static injections;
    private static allInjections;
    private static injectedParameters;
    private static _container;
    static getContainer(): IContainer;
    static build(refresh?: boolean): Promise<IContainer>;
    static setParameter(key: string | symbol | Constructor, value: any): void;
    static registerService(targetType: Constructor, config: ServiceConfig): void;
    static registerFactory(factory: IFactory, targetType: ServiceClassIdentifier, config: ServiceConfig): void;
    static registerAttributeInject(service: ServiceClassIdentifier, key: string | symbol, config: InjectConfig): void;
    static registerConstructorInject(service: ServiceClassIdentifier, index: number, config: InjectConfig): void;
    static registerAttributeParameter(service: ServiceClassIdentifier, key: string | symbol, paramKey: string | symbol | Constructor): void;
    static registerConstructorParameter(service: ServiceClassIdentifier, index: number, paramKey: string | symbol | Constructor): void;
    static registerAttributeAllService(service: ServiceClassIdentifier, identifier: ServiceIdentifier, paramKey: string | symbol, refresh: boolean): void;
    static registerConstructorAllService(service: ServiceClassIdentifier, identifier: ServiceIdentifier, index: number, refresh: boolean): void;
}
export default Registrer;
