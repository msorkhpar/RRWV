import React from 'react';
import {Config} from '../../config/config';

const GraphVisualization = ({
                                graph,
                                selectedNodes,
                                selectedEdges,
                                currentNode,
                                isOriginal = true,
                                width,
                                height,
                                scale
                            }) => {
    const viewBox = `0 0 ${Config.BASE_WIDTH} ${Config.BASE_HEIGHT}`;

    return (
        <svg
            width={width}
            height={height}
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            className={isOriginal ? 'border border-gray-200 bg-white' : 'fixed'}
            style={!isOriginal ? {
                top: Config.FINAL_GRAPH_POSITION.TOP,
                right: Config.FINAL_GRAPH_POSITION.RIGHT,
                backgroundColor: 'transparent'
            } : undefined}
        >
            {graph.edges.map(([from, to]) => {
                const edgeId = `${Math.min(from, to)}-${Math.max(from, to)}`;
                const isSelected = selectedEdges.has(edgeId);
                if (!isOriginal && !isSelected) return null;
                return (
                    <line
                        key={edgeId}
                        x1={graph.nodes[from].x}
                        y1={graph.nodes[from].y}
                        x2={graph.nodes[to].x}
                        y2={graph.nodes[to].y}
                        stroke={isSelected ? "#ef4444" : "#ddd"}
                        strokeWidth={isSelected ? "3" : "1"}
                    />
                );
            })}

            {graph.nodes.map((node) => {
                const isSelected = selectedNodes.has(node.id);
                if (!isOriginal && !isSelected) return null;
                return (
                    <g key={node.id}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.level === 0 ? Config.NODE_RADIUS.CENTER : Config.NODE_RADIUS.REGULAR}
                            fill={isSelected ? "#ef4444" : "#4f46e5"}
                            stroke={currentNode === node.id ? "#000" : "none"}
                            strokeWidth="2"
                        />
                        <text
                            x={node.x}
                            y={node.y + 20}
                            textAnchor="middle"
                            fill="#666"
                            fontSize="10"
                        >
                            {node.id}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default GraphVisualization;