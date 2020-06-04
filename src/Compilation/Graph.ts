export class Link {
    constructor(
        public fromId: string,
        public toId: string,
        public data: any | null = null) {}
}

export class Node {

    public links: Array<Link> = [];
    constructor(public readonly id: string, public data: any | null = null) {}
}

export class Graph {

    private nodes: Map<string, Node> = new Map();

    addNode(nodeId: string, data: any | null = null) {
        const node = this.getNode(nodeId) || new Node(nodeId, data);
        this.nodes.set(nodeId, node);
        return node;
    }

    getNode(nodeId: string): Node | null {
        return this.nodes.get(nodeId) || null;
    }

    getNodeDependencies(nodeId: string): Node[] {
        const node = this.getNode(nodeId);
        if (node) {
            return node.links
                .filter((l) => l.toId === node.id)
                .map((l) => this.getNode(l.fromId) as Node);
        }
        else return [];
    }

    hasNode(nodeId: string): boolean {
        return this.nodes.has(nodeId);
    }

    addLink(fromId: string, toId: string, data: any | null = null) {
        const fromNode = this.getNode(fromId) || this.addNode(fromId);
        const toNode = this.getNode(toId) || this.addNode(toId);
        const link = new Link(fromId, toId, data);
        fromNode.links.push(link);
        toNode.links.push(link);
    }

    forEachNode(callback: (node: Node) => void) {
        this.nodes.forEach((n) => callback(n));
    }

    forEachLinkedNode(nodeId: string, callback: (otherNode: Node, link: Link) => void) {
        const node = this.getNode(nodeId);
        if (node) {
            node.links.forEach((l) => {
                if (l.fromId === node.id) {
                    callback(this.getNode(l.toId) as Node, l);
                }
            });
        }
    }
}