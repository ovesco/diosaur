export type Constructor = new (...args: any[]) => {};

export type ServiceIdentifier = string | symbol | Constructor;

export type ServiceClassIdentifier = string | symbol | Constructor;

export type ServiceRegistry = Map<ServiceIdentifier, Map<string | null, Object>>;

export type ParameterBag = Map<ServiceIdentifier, any>