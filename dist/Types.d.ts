export declare type Constructor = new (...args: any[]) => {};
export declare type ServiceIdentifier = string | symbol | Constructor;
export declare type ServiceClassIdentifier = string | symbol | Constructor;
export declare type ServiceRegistry = Map<ServiceIdentifier, Map<string | null, Object>>;
export declare type ParameterBag = Map<ServiceIdentifier, any>;
