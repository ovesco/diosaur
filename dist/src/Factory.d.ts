import IFactory from "./IFactory";
import { Constructor } from "./Types";
export declare class BasicFactory implements IFactory {
    private targetType;
    constructor(targetType: Constructor);
    resolve(data: any[]): any;
}
export declare class FunctionFactory implements IFactory {
    private serviceMaker;
    constructor(serviceMaker: (args: any[]) => Object);
    resolve(data: any[]): Object;
}
export declare class AsyncFunctionFactory implements IFactory {
    private serviceMaker;
    constructor(serviceMaker: (args: any[]) => Promise<Object>);
    resolve(data: any): Promise<Object>;
}
