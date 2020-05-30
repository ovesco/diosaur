import { ServiceClassIdentifier, ServiceIdentifier, Constructor } from "./Types";
/** Service */
export interface ServiceConfig {
    identifier: ServiceIdentifier;
    tag: string | null;
}
export declare const defaultConfig: (identifier: ServiceIdentifier) => ServiceConfig;
export declare const Service: (config?: Partial<ServiceConfig>) => <T extends Constructor>(target: T) => void;
/** Factory */
export declare const Factory: (createdService: ServiceClassIdentifier, config?: Partial<ServiceConfig>) => <T extends Constructor>(factoryConstructor: T) => void;
/** Inject */
export interface InjectConfig {
    tag: string | null;
    identifier: ServiceIdentifier;
}
export declare const defaultInjectConfig: (identifier: ServiceIdentifier) => {
    identifier: ServiceIdentifier;
    tag: null;
};
export declare const Inject: (config?: Partial<InjectConfig>) => (target: any, key: string | symbol, index?: number | undefined) => void;
/** Inject All */
export declare const InjectAll: (identifier: ServiceIdentifier) => (target: any, key: string | symbol, index?: number | undefined) => void;
/** Parameter injection */
export declare const Parameter: (paramKey: string | symbol | Constructor) => (target: any, key: string | symbol, index?: number | undefined) => void;
