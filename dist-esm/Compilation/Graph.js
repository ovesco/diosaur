export class Link {
    constructor(fromId, toId, data = null) {
        this.fromId = fromId;
        this.toId = toId;
        this.data = data;
    }
}
export class Node {
    constructor(id, data = null) {
        this.id = id;
        this.data = data;
        this.links = [];
    }
}
export class Graph {
    constructor() {
        this.nodes = new Map();
    }
    addNode(nodeId, data = null) {
        const node = this.getNode(nodeId) || new Node(nodeId, data);
        this.nodes.set(nodeId, node);
        return node;
    }
    getNode(nodeId) {
        return this.nodes.get(nodeId) || null;
    }
    getNodeDependencies(nodeId) {
        const node = this.getNode(nodeId);
        if (node) {
            return node.links
                .filter((l) => l.toId === node.id)
                .map((l) => this.getNode(l.fromId));
        }
        else
            return [];
    }
    hasNode(nodeId) {
        return this.nodes.has(nodeId);
    }
    addLink(fromId, toId, data = null) {
        const fromNode = this.getNode(fromId) || this.addNode(fromId);
        const toNode = this.getNode(toId) || this.addNode(toId);
        const link = new Link(fromId, toId, data);
        fromNode.links.push(link);
        toNode.links.push(link);
    }
    forEachNode(callback) {
        this.nodes.forEach((n) => callback(n));
    }
    forEachLinkedNode(nodeId, callback) {
        const node = this.getNode(nodeId);
        if (node) {
            node.links.forEach((l) => {
                if (l.fromId === node.id) {
                    callback(this.getNode(l.toId), l);
                }
            });
        }
    }
}
//# sourceMappingURL=Graph.js.map