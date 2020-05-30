import IFactory from "../IFactory";
import { ServiceClassIdentifier } from "../Types";
import { ServiceConfig } from "../Decorators";

export default class RegisteredFactory {

    constructor(public readonly factory: IFactory,
        public readonly serviceClass: ServiceClassIdentifier,
        public readonly config: ServiceConfig) {
        }
}