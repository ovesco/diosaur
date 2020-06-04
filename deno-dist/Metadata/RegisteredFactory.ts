import IFactory from "../IFactory.ts";
import { ServiceClassIdentifier } from "../Types.ts";
import { ServiceConfig } from "../Decorators.ts";
export default class RegisteredFactory {
    constructor(public readonly factory: IFactory, public readonly serviceClass: ServiceClassIdentifier, public readonly config: ServiceConfig) {
    }
}
