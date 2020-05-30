import IFactory from "./IFactory";
import { Constructor } from "./Types";

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

    async resolve() {
        return await this.serviceMaker();
    }
}