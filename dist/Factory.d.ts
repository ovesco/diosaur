import IFactory from "./IFactory";
import { Constructor } from "./Types";
export declare class BasicFactory implements IFactory {
    private targetType;
    constructor(targetType: Constructor);
    resolve(data: any[]): Promise<{}>;
}
export declare class FunctionFactory implements IFactory {
    private serviceMaker;
    constructor(serviceMaker: () => Object | Promise<Object>);
    resolve(): Promise<Object>;
}
