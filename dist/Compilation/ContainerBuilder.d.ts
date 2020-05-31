import RegisteredFactory from "../Metadata/RegisteredFactory";
import { BaseInjectedService } from "../Metadata/ServiceInjection";
import { BaseInjectedParameter } from "../Metadata/ParameterInjection";
import { BaseInjectAllService } from "../Metadata/AllServiceInjection";
import { ParameterBag } from "../Types";
import { Container } from "../Container";
declare class ContainerBuilder {
    private parameters;
    private dependencyGraph;
    constructor(factories: RegisteredFactory[], injections: BaseInjectedService[], registeredParameters: BaseInjectedParameter[], registeredAllInjections: BaseInjectAllService[], parameters: ParameterBag);
    buildContainer(): Promise<Container>;
    private buildServiceRegistry;
    private buildService;
}
export default ContainerBuilder;
