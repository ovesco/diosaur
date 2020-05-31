import IFactory from "../IFactory";
import { ServiceClassIdentifier } from "../Types";
import { ServiceConfig } from "../Decorators";
export default class RegisteredFactory {
    readonly factory: IFactory;
    readonly serviceClass: ServiceClassIdentifier;
    readonly config: ServiceConfig;
    constructor(factory: IFactory, serviceClass: ServiceClassIdentifier, config: ServiceConfig);
}
