import IFactory from "./IFactory";
import { Constructor } from "./Types";

export class BasicFactory implements IFactory {
    
    constructor(private targetType: Constructor) {
    }

    resolve(data: any[]) {
        return Reflect.construct(this.targetType, data);
    }
}

export class FunctionFactory implements IFactory {
    
    constructor(private serviceMaker: (args: any[]) => Object) {
    }

    resolve(data: any[]) {
        return this.serviceMaker(data);
    }
}

export class AsyncFunctionFactory implements IFactory {

    constructor(private serviceMaker: (args: any[]) => Promise<Object>) {
    }

    async resolve(data: any) {
        return await this.serviceMaker(data);
    }
}