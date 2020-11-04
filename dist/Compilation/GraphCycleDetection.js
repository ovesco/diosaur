"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GraphCycleDetection {
    constructor(graph) {
        this.graph = graph;
        this.visited = new Map();
        this.beingVisited = new Map();
    }
    hasCycle() {
        let result = false;
        this.graph.forEachNode((node) => {
            if (this.nodeHasCycle(node))
                result = true;
        });
        return result;
    }
    nodeHasCycle(node) {
        this.beingVisited.set(node.id, true);
        let result = false;
        this.graph.forEachLinkedNode(node.id, (otherNode) => {
            if (this.beingVisited.get(otherNode.id)) {
                result = true;
            }
            else if (!this.visited.get(otherNode.id) && this.nodeHasCycle(otherNode)) {
                result = true;
            }
        });
        this.beingVisited.set(node.id, false);
        this.visited.set(node.id, true);
        return result;
    }
}
exports.default = GraphCycleDetection;
//# sourceMappingURL=GraphCycleDetection.js.map