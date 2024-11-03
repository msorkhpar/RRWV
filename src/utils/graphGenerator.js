import {Config} from '../config/config';

const generateGraphStructure = () => {
    const nodes = [{id: 0, x: 400, y: 350, level: 0}];
    const edges = [];

    // First neighborhood
    for (let i = 1; i <= Config.FIRST_LEVEL_NODES; i++) {
        const angle = ((2 * Math.PI) / Config.FIRST_LEVEL_NODES) * (i - 1);
        const radius = 100;
        nodes.push({
            id: i,
            x: 400 + radius * Math.cos(angle),
            y: 350 + radius * Math.sin(angle),
            level: 1
        });
        edges.push([0, i]);

        for (let j = 1; j < i; j++) {
            if (Math.abs(i - j) <= Config.FIRST_LEVEL_MAX_DISTANCE ||
                Math.abs(i - j) >= Config.FIRST_LEVEL_NODES - Config.FIRST_LEVEL_MAX_DISTANCE) {
                if (Math.random() < Config.FIRST_LEVEL_DENSITY) {
                    edges.push([i, j]);
                }
            }
        }
    }

    // Second neighborhood
    for (let i = Config.FIRST_LEVEL_NODES + 1; i <= Config.FIRST_LEVEL_NODES + Config.SECOND_LEVEL_NODES; i++) {
        const angle = ((2 * Math.PI) / Config.SECOND_LEVEL_NODES) * (i - Config.FIRST_LEVEL_NODES - 1);
        const radius = 200;
        nodes.push({
            id: i,
            x: 400 + radius * Math.cos(angle),
            y: 350 + radius * Math.sin(angle),
            level: 2
        });

        const connections = 1 + Math.floor(Math.random() * Config.SECOND_TO_FIRST_CONNECTIONS);
        const firstLevelAngle = angle;
        const possibleConnections = [...Array(Config.FIRST_LEVEL_NODES)].map((_, idx) => {
            const nodeIdx = idx + 1;
            const nodeAngle = ((2 * Math.PI) / Config.FIRST_LEVEL_NODES) * (idx);
            return {
                id: nodeIdx,
                angleDiff: Math.abs(nodeAngle - firstLevelAngle)
            };
        }).sort((a, b) => a.angleDiff - b.angleDiff);

        for (let j = 0; j < connections; j++) {
            edges.push([i, possibleConnections[j].id]);
        }

        for (let j = Config.FIRST_LEVEL_NODES + 1; j < i; j++) {
            if (Math.abs(i - j) <= Config.SECOND_LEVEL_MAX_DISTANCE ||
                Math.abs(i - j) >= Config.SECOND_LEVEL_NODES - Config.SECOND_LEVEL_MAX_DISTANCE) {
                if (Math.random() < Config.SECOND_LEVEL_DENSITY) {
                    edges.push([i, j]);
                }
            }
        }
    }

    // Third neighborhood
    const thirdLevelStart = Config.FIRST_LEVEL_NODES + Config.SECOND_LEVEL_NODES + 1;
    for (let i = thirdLevelStart; i < thirdLevelStart + Config.THIRD_LEVEL_NODES; i++) {
        const angle = ((2 * Math.PI) / Config.THIRD_LEVEL_NODES) * (i - thirdLevelStart);
        const radius = 300;
        nodes.push({
            id: i,
            x: 400 + radius * Math.cos(angle),
            y: 350 + radius * Math.sin(angle),
            level: 3
        });

        const connections = 1 + Math.floor(Math.random() * Config.THIRD_TO_SECOND_CONNECTIONS);
        const secondLevelAngle = angle;
        const possibleConnections = [...Array(Config.SECOND_LEVEL_NODES)].map((_, idx) => {
            const nodeIdx = Config.FIRST_LEVEL_NODES + 1 + idx;
            const nodeAngle = ((2 * Math.PI) / Config.SECOND_LEVEL_NODES) * idx;
            return {
                id: nodeIdx,
                angleDiff: Math.abs(nodeAngle - secondLevelAngle)
            };
        }).sort((a, b) => a.angleDiff - b.angleDiff);

        for (let j = 0; j < connections; j++) {
            edges.push([i, possibleConnections[j].id]);
        }

        for (let j = thirdLevelStart; j < i; j++) {
            if (Math.abs(i - j) <= Config.THIRD_LEVEL_MAX_DISTANCE ||
                Math.abs(i - j) >= Config.THIRD_LEVEL_NODES - Config.THIRD_LEVEL_MAX_DISTANCE) {
                if (Math.random() < Config.THIRD_LEVEL_DENSITY) {
                    edges.push([i, j]);
                }
            }
        }
    }

    return {nodes, edges};
};

export default generateGraphStructure;