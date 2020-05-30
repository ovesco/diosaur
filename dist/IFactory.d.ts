export default interface IFactory {
    resolve(data: any[]): Promise<Object>;
}
