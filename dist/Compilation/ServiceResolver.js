"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RegisteredFactory_1 = __importDefault(require("../Metadata/RegisteredFactory"));
const ServiceInjection_1 = require("../Metadata/ServiceInjection");
const ParameterInjection_1 = require("../Metadata/ParameterInjection");
const AllServiceInjection_1 = require("../Metadata/AllServiceInjection");
const DependencyGraph_1 = __importDefault(require("./DependencyGraph"));
const Decorators_1 = require("../Decorators");
const Errors_1 = require("../Errors");
const LazyProxy_1 = __importDefault(require("./LazyProxy"));
class ServiceResolver {
    constructor(factories, injections, registeredParameters, registeredAllInjections, parameters) {
        this.factories = factories;
        this.parameters = parameters;
        this.identifierTags = new Map();
        this.scopeServices = new Map();
        this.singletons = new Map();
        const graph = new DependencyGraph_1.default(factories, injections, registeredParameters, registeredAllInjections, parameters);
        this.graph = graph.build();
        factories.forEach((injection) => {
            const { tag, identifier } = injection.config;
            if (!this.identifierTags.has(identifier))
                this.identifierTags.set(identifier, []);
            if (this.identifierTags.get(identifier).includes(tag)) {
                throw new Error(`Trying to register 2 services identified with ${identifier.toString()} and tag ${tag}`);
            }
            this.identifierTags.get(identifier).push(tag);
        });
    }
    warmup() {
        return __awaiter(this, void 0, void 0, function* () {
            const singletons = [];
            this.graph.forEachNode((node) => {
                if (node.data instanceof RegisteredFactory_1.default && node.data.config.scoping === Decorators_1.SCOPES.singleton) {
                    singletons.push(node);
                }
            });
            for (const singleton of singletons) {
                const { config } = singleton.data;
                const service = yield this.instanciateAsync(singleton);
                if (!this.singletons.has(config.identifier))
                    this.singletons.set(config.identifier, new Map());
                this.singletons.get(config.identifier).set(config.tag, service);
            }
        });
    }
    enterScope(scope) {
        if (!this.scopeServices.has(scope)) {
            this.scopeServices.set(scope, new Map());
        }
    }
    exitScope(scope) {
        if (this.scopeServices.has(scope)) {
            // Copy all service instance into other scopes if any
            const services = this.scopeServices.get(scope);
            this.scopeServices.delete(scope);
            services.forEach((tagsServices, identifier) => {
                tagsServices.forEach((service, tag) => {
                    const { config } = this.graph.getNode(DependencyGraph_1.default.serviceKey(identifier, tag)).data;
                    const intersectingScopes = this.getCurrentScopes().filter(it => config.customScopes.includes(it));
                    if (intersectingScopes.length > 0) {
                        const nextScope = intersectingScopes[0];
                        if (!this.scopeServices.has(nextScope))
                            this.scopeServices.set(nextScope, new Map());
                        if (!this.scopeServices.get(nextScope).has(identifier)) {
                            this.scopeServices.get(nextScope).set(identifier, new Map());
                        }
                        this.scopeServices.get(nextScope)
                            .get(identifier)
                            .set(tag, service);
                    }
                });
            });
        }
    }
    getParameter(paramKey) {
        return this.parameters.get(paramKey);
    }
    getAll(identifier) {
        if (!this.identifierTags.has(identifier)) {
            throw new Errors_1.UnregisteredServiceError(identifier, null, true);
        }
        return this.identifierTags.get(identifier).map(tag => this.get(identifier, tag));
    }
    get(identifier, tag) {
        tag = this.resolveTag(tag);
        const node = this.graph.getNode(DependencyGraph_1.default.serviceKey(identifier, tag));
        if (!node) {
            throw new Errors_1.UnregisteredServiceError(identifier, tag);
        }
        const serviceConfig = node.data;
        switch (serviceConfig.config.scoping) {
            case Decorators_1.SCOPES.singleton:
                return this.singletons.get(identifier).get(tag);
            case Decorators_1.SCOPES.newable:
                return this.instanciate(node);
            case Decorators_1.SCOPES.custom:
                const availableScopes = this.getCurrentScopes().filter(it => serviceConfig.config.customScopes.includes(it));
                for (const scope of availableScopes) {
                    if (this.scopeServices.has(scope)
                        && this.scopeServices.get(scope).has(identifier)
                        && this.scopeServices.get(scope).get(identifier).has(tag)) {
                        return this.scopeServices.get(scope).get(identifier).get(tag);
                    }
                }
                // No service in scope yet, add a new
                const service = this.instanciate(node);
                if (availableScopes.length > 0) {
                    const scope = availableScopes[0];
                    if (!this.scopeServices.has(scope))
                        this.scopeServices.set(scope, new Map());
                    if (!this.scopeServices.get(scope).has(identifier)) {
                        this.scopeServices.get(scope).set(identifier, new Map());
                    }
                    this.scopeServices.get(scope).get(identifier).set(tag, service);
                }
                return service;
            default:
                throw new Error(`Unknown scope type ${serviceConfig.config.scoping}`);
        }
    }
    getCurrentScopes() {
        return [...this.scopeServices.keys()];
    }
    resolveTag(tag) {
        if (tag !== null && tag.startsWith('@')) {
            const paramKey = tag.slice(1);
            if (!this.parameters.has(paramKey)) {
                throw new Error(`Trying to reference a dependency with a parameter, given key ${tag} but no parameter set`);
            }
            else
                return this.getParameter(paramKey);
        }
        return tag;
    }
    instanciate(node) {
        const config = node.data;
        const [constructorParams, attributes] = this.buildServiceDependencies(node);
        // Factory resolve is not async, we block it in decorator thus we can simply call resolve
        const service = config.factory.resolve(constructorParams);
        return this.postServiceCreation(service, attributes);
    }
    instanciateAsync(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = node.data;
            const [constructorParams, attributes] = yield this.buildServiceDependenciesAsync(node);
            const service = yield config.factory.resolve(constructorParams);
            return this.postServiceCreation(service, attributes);
        });
    }
    postServiceCreation(service, attributes) {
        attributes.forEach(({ key, arg }) => {
            Reflect.defineProperty(service, key, {
                get: () => arg,
            });
        });
        return service;
    }
    setTo(parameters, attributes, arg, data) {
        if (data.getType() === 'constructor') {
            parameters.push({
                arg,
                index: data.index
            });
        }
        else if (data.getType() === 'attribute') {
            attributes.push({
                arg,
                key: data.attributeKey,
            });
        }
    }
    buildServiceDependencies(node) {
        const parameters = [];
        const attributes = [];
        node.links.filter((link) => link.toId === node.id).forEach((dependencyLink) => {
            const { data } = dependencyLink;
            let arg = null;
            if (data instanceof ParameterInjection_1.BaseInjectedParameter) {
                arg = this.getParameter(data.parameterKey);
            }
            else if (data instanceof ServiceInjection_1.BaseInjectedService) {
                arg = data.config.refresh
                    ? new LazyProxy_1.default(() => this.get(data.config.identifier, data.config.tag))
                    : this.get(data.config.identifier, data.config.tag);
            }
            else if (data instanceof AllServiceInjection_1.BaseInjectAllService) {
                arg = data.refresh
                    ? new LazyProxy_1.default(() => this.getAll(data.identifier))
                    : this.getAll(data.identifier);
            }
            this.setTo(parameters, attributes, arg, data);
        });
        return [
            parameters.sort((a, b) => a.index > b.index ? 1 : -1).map(it => it.arg),
            attributes
        ];
    }
    buildServiceDependenciesAsync(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = [];
            const attributes = [];
            const dependencyLinksData = [];
            node.links.filter((link) => link.toId === node.id).forEach((dependencyLink) => {
                dependencyLinksData.push(dependencyLink.data);
            });
            for (const data of dependencyLinksData) {
                let arg = null;
                if (data instanceof ParameterInjection_1.BaseInjectedParameter) {
                    arg = this.getParameter(data.parameterKey);
                }
                else if (data instanceof ServiceInjection_1.BaseInjectedService) {
                    arg = data.config.refresh
                        ? new LazyProxy_1.default(() => this.get(data.config.identifier, data.config.tag))
                        : yield this.getAsync(data.config.identifier, data.config.tag);
                }
                else if (data instanceof AllServiceInjection_1.BaseInjectAllService) {
                    arg = data.refresh
                        ? new LazyProxy_1.default(() => this.getAll(data.identifier))
                        : yield this.getAllAsync(data.identifier);
                }
                this.setTo(parameters, attributes, arg, data);
            }
            return [
                parameters.sort((a, b) => a.index > b.index ? 1 : -1).map(it => it.arg),
                attributes
            ];
        });
    }
    getAllAsync(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.identifierTags.has(identifier)) {
                throw new Errors_1.UnregisteredServiceError(identifier, null, true);
            }
            const services = [];
            // @ts-ignore
            for (const tag of this.identifierTags.get(identifier)) {
                services.push(yield this.getAsync(identifier, tag));
            }
            return services;
        });
    }
    getAsync(identifier, tag) {
        return __awaiter(this, void 0, void 0, function* () {
            tag = this.resolveTag(tag);
            const node = this.graph.getNode(DependencyGraph_1.default.serviceKey(identifier, tag));
            if (!node) {
                throw new Errors_1.UnregisteredServiceError(identifier, tag);
            }
            const data = node.data;
            if (data.config.scoping === Decorators_1.SCOPES.singleton) {
                const existingInstance = this.singletons.get(data.config.identifier).get(data.config.tag);
                return existingInstance ? existingInstance : yield this.instanciateAsync(node);
            }
            else
                return this.get(identifier, tag);
        });
    }
}
exports.default = ServiceResolver;
