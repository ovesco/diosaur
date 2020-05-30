var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import DependencyGraph from "./DependencyGraph";
import { BaseInjectedService } from "../Metadata/ServiceInjection";
import { BaseInjectAllService } from "../Metadata/AllServiceInjection";
import { Container } from "../Container";
import GraphCycleDetection from "./GraphCycleDetection";
import { CircularDependencyError } from "../Errors";
class ContainerBuilder {
    constructor(factories, injections, registeredParameters, registeredAllInjections, parameters) {
        this.parameters = parameters;
        this.dependencyGraph = new DependencyGraph(factories, injections, registeredParameters, registeredAllInjections, parameters);
        this.dependencyGraph.build();
    }
    buildContainer() {
        return __awaiter(this, void 0, void 0, function* () {
            const registry = yield this.buildServiceRegistry();
            return new Container(registry, this.parameters);
        });
    }
    buildServiceRegistry() {
        return __awaiter(this, void 0, void 0, function* () {
            const registry = new Map();
            const cycleDetection = new GraphCycleDetection(this.dependencyGraph.getGraph());
            if (cycleDetection.hasCycle()) {
                throw new CircularDependencyError();
            }
            yield this.dependencyGraph.detectGraphServiceLeaves().reduce((acc, node) => acc.then(() => new Promise((resolve) => {
                this.buildService(registry, node).then(() => resolve());
            })), Promise.resolve());
            return registry;
        });
    }
    buildService(registry, node) {
        return __awaiter(this, void 0, void 0, function* () {
            const nodeMetadata = node.data;
            const { identifier, tag } = nodeMetadata.config;
            if (!registry.has(identifier)) {
                registry.set(identifier, new Map());
            }
            // @ts-ignore
            if (registry.get(identifier).has(tag))
                return registry.get(identifier).get(tag);
            const dependencyParameters = [];
            const linkedDependencies = (node.links || []).filter(l => node.id === l.toId);
            yield linkedDependencies.reduce((acc, dependencyLink) => acc.then(() => new Promise((resolve) => {
                const dependencyNode = this.dependencyGraph.getGraph().getNode(dependencyLink.fromId);
                if (dependencyLink.data instanceof BaseInjectedService) {
                    this.buildService(registry, dependencyNode).then((service) => {
                        if (dependencyLink.data.getType() === 'constructor') {
                            const dependencyData = dependencyLink.data;
                            dependencyParameters.splice(dependencyData.index, 0, service);
                        }
                        resolve();
                    });
                }
                else if (dependencyLink.data instanceof BaseInjectAllService) {
                    // Inject all known dependencies
                    const linkedServices = dependencyNode.links.filter(depLink => depLink.toId === dependencyNode.id).map(it => it.fromId);
                    const servicesToInject = [];
                    linkedServices.reduce((acc, linkedServiceKey) => acc.then(() => new Promise((resolveAll) => {
                        this.buildService(registry, this.dependencyGraph.getGraph().getNode(linkedServiceKey)).then((linkedService) => {
                            servicesToInject.push(linkedService);
                            resolveAll();
                        });
                    })), Promise.resolve()).then(() => {
                        if (dependencyLink.data.getType() === 'constructor') {
                            const dependencyData = dependencyLink.data;
                            dependencyParameters.splice(dependencyData.index, 0, servicesToInject);
                        }
                        resolve();
                    });
                }
                else {
                    if (dependencyLink.data.getType() === 'constructor') {
                        const dependencyData = dependencyLink.data;
                        dependencyParameters.splice(dependencyData.index, 0, this.parameters.get(dependencyData.parameterKey));
                    }
                    resolve();
                }
            })), Promise.resolve());
            // Build service
            const service = yield nodeMetadata.factory.resolve(dependencyParameters);
            // @ts-ignore
            registry.get(identifier).set(tag, service);
            return service;
        });
    }
}
export default ContainerBuilder;
