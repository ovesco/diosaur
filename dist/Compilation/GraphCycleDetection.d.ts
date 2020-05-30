import { Graph } from "./Graph";
declare class GraphCycleDetection {
    private graph;
    private visited;
    private beingVisited;
    constructor(graph: Graph);
    hasCycle(): boolean;
    private nodeHasCycle;
}
export default GraphCycleDetection;
