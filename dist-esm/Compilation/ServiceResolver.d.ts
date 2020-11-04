import RegisteredFactory from "../Metadata/RegisteredFactory";
import { BaseInjectedService } from "../Metadata/ServiceInjection";
import { BaseInjectedParameter } from "../Metadata/ParameterInjection";
import { BaseInjectAllService } from "../Metadata/AllServiceInjection";
import { ParameterBag, ServiceIdentifier, Constructor } from "../Types";
declare class ServiceResolver {
    private factories;
    private parameters;
    private graph;
    private identifierTags;
    private scopeServices;
    private singletons;
    constructor(factories: RegisteredFactory[], injections: BaseInjectedService[], registeredParameters: BaseInjectedParameter[], registeredAllInjections: BaseInjectAllService[], parameters: ParameterBag);
    warmup(): Promise<void>;
    enterScope(scope: string): void;
    exitScope(scope: string): void;
    getParameter(paramKey: string | symbol | Constructor): any;
    getAll(identifier: ServiceIdentifier): (object | undefined)[];
    get(identifier: ServiceIdentifier, tag: string | null): object | undefined;
    private getCurrentScopes;
    private resolveTag;
    private instanciate;
    private instanciateAsync;
    private postServiceCreation;
    private setTo;
    private buildServiceDependencies;
    private buildServiceDependenciesAsync;
    private getAllAsync;
    private getAsync;
}
export default ServiceResolver;