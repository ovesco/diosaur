import DependencyGraph from "./DependencyGraph";
import RegisteredFactory from "../Metadata/RegisteredFactory";
import { BaseInjectedService, ConstructorInjectedService } from "../Metadata/ServiceInjection";
import { BaseInjectedParameter, ConstructorInjectedParameter } from "../Metadata/ParameterInjection";
import { BaseInjectAllService, ConstructorInjectAllService } from "../Metadata/AllServiceInjection";
import { ParameterBag, ServiceRegistry } from "../Types";
import { Container } from "../Container";
import GraphCycleDetection from "./GraphCycleDetection";
import { CircularDependencyError } from "../Errors";
import { Node } from './Graph';

class ContainerBuilder {

    private dependencyGraph: DependencyGraph;

    constructor(factories: RegisteredFactory[],
        injections: BaseInjectedService[],
        registeredParameters: BaseInjectedParameter[],
        registeredAllInjections: BaseInjectAllService[],
        private parameters: ParameterBag) {

            this.dependencyGraph = new DependencyGraph(factories, injections, registeredParameters, registeredAllInjections, parameters);
            this.dependencyGraph.build();
    }

    async buildContainer() {
        const registry = await this.buildServiceRegistry();
        return new Container(registry, this.parameters);
    }

    private async buildServiceRegistry() {
        const registry: ServiceRegistry = new Map();
        const cycleDetection = new GraphCycleDetection(this.dependencyGraph.getGraph());
        if (cycleDetection.hasCycle()) {
            throw new CircularDependencyError();
        }

        await this.dependencyGraph.detectGraphServiceLeaves().reduce((acc, node) => acc.then(() => new Promise<void>((resolve) => {
            this.buildService(registry, node).then(() => resolve());
        })), Promise.resolve());
        return registry;
    }

    private async buildService(registry: ServiceRegistry, node: Node): Promise<Object> {
        const nodeMetadata = node.data as RegisteredFactory;
        const { identifier, tag } = nodeMetadata.config;
        if (!registry.has(identifier)) {
            registry.set(identifier, new Map());
        }

        // @ts-ignore
        if (registry.get(identifier).has(tag)) return registry.get(identifier).get(tag);

        const dependencyParameters: Object[] = [];
        const linkedDependencies = (node.links || []).filter(l => node.id === l.toId);
        await linkedDependencies.reduce((acc, dependencyLink) => acc.then(() => new Promise<void>((resolve) => {
            const dependencyNode = this.dependencyGraph.getGraph().getNode(dependencyLink.fromId) as Node;

            if (dependencyLink.data instanceof BaseInjectedService) {
                this.buildService(registry, dependencyNode).then((service) => {
                    if (dependencyLink.data.getType() === 'constructor') {
                        const dependencyData = dependencyLink.data as ConstructorInjectedService;
                        dependencyParameters.splice(dependencyData.index, 0, service);
                    }
                    resolve();
                });
            } else if (dependencyLink.data instanceof BaseInjectAllService) {
                // Inject all known dependencies
                const linkedServices = dependencyNode.links.filter(depLink => depLink.toId === dependencyNode.id).map(it => it.fromId);
                const servicesToInject: Object[] = [];
                linkedServices.reduce((acc, linkedServiceKey) => acc.then(() => new Promise<void>((resolveAll) => {
                    this.buildService(registry, this.dependencyGraph.getGraph().getNode(linkedServiceKey) as Node).then((linkedService) => {
                        servicesToInject.push(linkedService);
                        resolveAll();
                    });
                })), Promise.resolve()).then(() => {
                    if (dependencyLink.data.getType() === 'constructor') {
                        const dependencyData = dependencyLink.data as ConstructorInjectAllService;
                        dependencyParameters.splice(dependencyData.index, 0, servicesToInject);
                    }
                    resolve();
                });
            } else {
                if (dependencyLink.data.getType() === 'constructor') {
                    const dependencyData = dependencyLink.data as ConstructorInjectedParameter;
                    dependencyParameters.splice(dependencyData.index, 0, this.parameters.get(dependencyData.parameterKey));
                }
                resolve();
            }
        })), Promise.resolve());

        // Build service
        const service = await nodeMetadata.factory.resolve(dependencyParameters);
        // @ts-ignore
        registry.get(identifier).set(tag, service);
        return service;
    }
}

export default ContainerBuilder;