import { Graph, Node } from "./Graph";
import { ServiceIdentifier, ParameterBag } from "../Types";
import RegisteredFactory from "../Metadata/RegisteredFactory";
import { BaseInjectedService } from "../Metadata/ServiceInjection";
import { BaseInjectedParameter } from "../Metadata/ParameterInjection";
import { BaseInjectAllService } from "../Metadata/AllServiceInjection";
declare class DependencyGraph {
    private factories;
    private injections;
    private injectedParameters;
    private allInjections;
    private parameterBag;
    private dependencyGraph;
    private serviceClassToKey;
    private identifierServices;
    private built;
    constructor(factories: RegisteredFactory[], injections: BaseInjectedService[], injectedParameters: BaseInjectedParameter[], allInjections: BaseInjectAllService[], parameterBag: ParameterBag);
    getGraph(): Graph;
    build(): void;
    detectGraphServiceLeaves(): Node[];
    serviceKey(identifier: ServiceIdentifier, tag: string | null): string;
    paramKey(identifier: ServiceIdentifier): string;
    allServiceKey(identifier: ServiceIdentifier): string;
}
export default DependencyGraph;
