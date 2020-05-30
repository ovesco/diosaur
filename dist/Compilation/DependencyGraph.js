import { Graph } from "./Graph";
import { MissingServiceDefinitionError } from "../Errors";
import { resolveTag, uniqid } from "../Utils";
class DependencyGraph {
    constructor(factories, injections, injectedParameters, allInjections, parameterBag) {
        this.factories = factories;
        this.injections = injections;
        this.injectedParameters = injectedParameters;
        this.allInjections = allInjections;
        this.parameterBag = parameterBag;
        this.dependencyGraph = new Graph();
        this.serviceClassToKey = new Map();
        this.identifierServices = new Map();
        this.built = false;
    }
    getGraph() {
        if (!this.built) {
            this.build();
        }
        return this.dependencyGraph;
    }
    build() {
        this.factories.forEach((registeredFactory) => {
            const { identifier } = registeredFactory.config;
            const key = this.serviceKey(identifier, registeredFactory.config.tag);
            if (this.dependencyGraph.hasNode(key)) {
                throw new Error(`Trying to register ${registeredFactory.serviceClass.toString()}, but another service exist for the same identifier and same tag`);
            }
            this.serviceClassToKey.set(registeredFactory.serviceClass, key);
            this.dependencyGraph.addNode(key, registeredFactory);
            if (!this.identifierServices.has(identifier)) {
                this.identifierServices.set(identifier, []);
            }
            // @ts-ignore
            this.identifierServices.get(identifier).push(registeredFactory.serviceClass);
        });
        this.parameterBag.forEach((value, key) => {
            const paramKey = this.paramKey(key);
            this.dependencyGraph.addNode(paramKey, value);
        });
        this.injections.forEach((injectedService) => {
            const serviceKey = this.serviceClassToKey.get(injectedService.serviceClass);
            const injectedServiceKey = this.serviceKey(injectedService.config.identifier, resolveTag(injectedService.config.tag, this.parameterBag));
            if (!this.dependencyGraph.hasNode(serviceKey) || !this.dependencyGraph.hasNode(injectedServiceKey)) {
                throw new MissingServiceDefinitionError(`Trying to inject service ${injectedServiceKey} into ${serviceKey} but one of them is not registered`);
            }
            this.dependencyGraph.addLink(injectedServiceKey, serviceKey, injectedService);
        });
        this.allInjections.forEach((registeredAllInjection) => {
            const { identifier } = registeredAllInjection;
            const allKey = this.allServiceKey(identifier);
            const serviceKey = this.serviceClassToKey.get(registeredAllInjection.serviceClass);
            if (!this.dependencyGraph.hasNode(serviceKey) || !this.identifierServices.has(identifier)) {
                throw new MissingServiceDefinitionError(`Trying to inject ${allKey} services into ${serviceKey} but one of those definition doesn't exist`);
            }
            if (!this.dependencyGraph.hasNode(allKey)) {
                this.dependencyGraph.addNode(allKey);
                // @ts-ignore
                this.identifierServices.get(identifier).map(serviceConstructor => this.serviceClassToKey.get(serviceConstructor)).forEach((relatedDependencyKey) => {
                    this.dependencyGraph.addLink(relatedDependencyKey, allKey);
                });
            }
            this.dependencyGraph.addLink(allKey, serviceKey, registeredAllInjection);
        });
        this.injectedParameters.forEach((injectedParameter) => {
            const serviceKey = this.serviceClassToKey.get(injectedParameter.serviceClass);
            const injectedParameterKey = this.paramKey(injectedParameter.parameterKey);
            if (!(this.dependencyGraph.hasNode(serviceKey) && this.dependencyGraph.hasNode(injectedParameterKey))) {
                throw new MissingServiceDefinitionError(`Trying to inject parameter ${injectedParameterKey} into ${serviceKey} but one of them is not registered`);
            }
            this.dependencyGraph.addLink(injectedParameterKey, serviceKey, injectedParameter);
        });
        this.built = true;
    }
    detectGraphServiceLeaves() {
        const leaves = [];
        this.dependencyGraph.forEachNode((node) => {
            if (node.links === null || node.links.filter((link) => link.toId !== node.id).length === 0) {
                if (typeof node.id === 'string' && !node.id.startsWith('param-')) {
                    leaves.push(node);
                }
            }
        });
        return leaves;
    }
    serviceKey(identifier, tag) {
        let identifierString = identifier.toString();
        if (typeof identifier === 'symbol')
            identifierString = uniqid();
        else if (typeof identifier === 'function')
            identifierString = identifier.name;
        return `${identifierString}(${tag || ''})`;
    }
    paramKey(identifier) {
        let identifierString = identifier.toString();
        if (typeof identifier === 'symbol')
            identifierString = uniqid();
        else if (typeof identifier === 'function')
            identifierString = identifier.name;
        return `param-${identifierString}`;
    }
    ;
    allServiceKey(identifier) {
        return `all-${this.serviceKey(identifier, null)}`;
    }
    ;
}
export default DependencyGraph;
