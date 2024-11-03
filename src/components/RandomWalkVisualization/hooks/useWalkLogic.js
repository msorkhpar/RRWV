import {useState, useCallback} from 'react';
import {Config} from '../../../config/config';

const useWalkLogic = (graph) => {
    const [selectedNodes, setSelectedNodes] = useState(new Set());
    const [selectedEdges, setSelectedEdges] = useState(new Set());
    const [currentNode, setCurrentNode] = useState(null);
    const [walkCount, setWalkCount] = useState(0);
    const [stepsInCurrentWalk, setStepsInCurrentWalk] = useState(0);
    const [isWalking, setIsWalking] = useState(false);

    const getConnectedNodes = useCallback((nodeId) => {
        return graph.edges
            .filter(([from, to]) => from === nodeId || to === nodeId)
            .map(([from, to]) => from === nodeId ? to : from);
    }, [graph]);

    const startWalk = useCallback(() => {
        setIsWalking(true);
        setWalkCount(0);
        setStepsInCurrentWalk(0);
        setSelectedNodes(new Set([0]));
        setSelectedEdges(new Set());
        setCurrentNode(0);
    }, []);

    const processNextStep = useCallback(() => {
        const processStep = () => {
            if (stepsInCurrentWalk === 2 || graph.nodes[currentNode]?.level === 2) {
                setCurrentNode(0);
                setStepsInCurrentWalk(0);
                if (graph.nodes[currentNode]?.level === 2) {
                    setWalkCount(prev => prev + 1);
                }
                return;
            }

            const connected = getConnectedNodes(currentNode);
            let validNext;

            if (currentNode === 0) {
                validNext = connected.filter(n => graph.nodes[n].level === 1);
            } else {
                const unvisited = connected.filter(n => !selectedNodes.has(n));
                validNext = unvisited.length > 0 ? unvisited : connected;
            }

            if (validNext.length > 0) {
                const nextNode = validNext[Math.floor(Math.random() * validNext.length)];
                setSelectedNodes(prev => new Set([...prev, nextNode]));
                setSelectedEdges(prev => new Set([...prev, `${Math.min(currentNode, nextNode)}-${Math.max(currentNode, nextNode)}`]));
                setCurrentNode(nextNode);
                setStepsInCurrentWalk(prev => prev + 1);

                if (graph.nodes[nextNode].level === 2) {
                    setWalkCount(prev => prev + 1);
                }
            }
        };

        if (!isWalking || walkCount >= Config.TOTAL_WALKS) {
            setIsWalking(false);
            return false;
        }

        processStep();
        return true;
    }, [isWalking, currentNode, walkCount, stepsInCurrentWalk, getConnectedNodes, graph.nodes]);

    return {
        // State
        selectedNodes,
        selectedEdges,
        currentNode,
        walkCount,
        stepsInCurrentWalk,
        isWalking,

        // Actions
        getConnectedNodes,
        startWalk,
        processNextStep,

        // Setters
        setIsWalking,
        setSelectedNodes,
        setSelectedEdges,
        setCurrentNode,
        setWalkCount,
        setStepsInCurrentWalk
    };
};
export default useWalkLogic;

