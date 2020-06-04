import { Graph, Node } from "./Graph.ts";
class GraphCycleDetection {
    private visited: Map<string | number, boolean> = new Map();
    private beingVisited: Map<string | number, boolean> = new Map();
    constructor(private graph: Graph) {
    }
    public hasCycle(): boolean {
        let result = false;
        this.graph.forEachNode((node) => {
            if (this.nodeHasCycle(node))
                result = true;
        });
        return result;
    }
    private nodeHasCycle(node: Node): boolean {
        this.beingVisited.set(node.id, true);
        let result = false;
        this.graph.forEachLinkedNode(node.id, (otherNode: Node) => {
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
export default GraphCycleDetection;
