export declare class Link {
    fromId: string;
    toId: string;
    data: any | null;
    constructor(fromId: string, toId: string, data?: any | null);
}
export declare class Node {
    readonly id: string;
    data: any | null;
    links: Array<Link>;
    constructor(id: string, data?: any | null);
}
export declare class Graph {
    private nodes;
    addNode(nodeId: string, data?: any | null): Node;
    getNode(nodeId: string): Node | null;
    hasNode(nodeId: string): boolean;
    addLink(fromId: string, toId: string, data?: any | null): void;
    forEachNode(callback: (node: Node) => void): void;
    forEachLinkedNode(nodeId: string, callback: (otherNode: Node, link: Link) => void): void;
}
