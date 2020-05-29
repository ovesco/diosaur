import IFactory from "./IFactory.ts";
import { Constructor } from "./Types.ts";

export class BasicFactory implements IFactory {
    
    constructor(private targetType: Constructor) {
    }

    async resolve(data: any[]) {
        const { targetType } = this;
        return new targetType(...data);
    }
}

export class FunctionFactory implements IFactory {
    
    constructor(private serviceMaker: () => Object | Promise<Object>) {
    }

    async resolve(data: any[]) {
        return await this.serviceMaker();
    }
}