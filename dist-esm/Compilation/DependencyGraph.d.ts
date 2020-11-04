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
    constructor(factories: RegisteredFactory[], injections: BaseInjectedService[], injectedParameters: BaseInjectedParameter[], allInjections: BaseInjectAllService[], parameterBag: ParameterBag);
    getNodeByIdentifier(identifier: ServiceIdentifier, tag: string | null): Node | null;
    build(): Graph;
    detectGraphServiceLeaves(): Node[];
    static serviceKey(identifier: ServiceIdentifier, tag: string | null): string;
    static paramKey(identifier: ServiceIdentifier): string;
    static allServiceKey(identifier: ServiceIdentifier): string;
}
export default DependencyGraph;
