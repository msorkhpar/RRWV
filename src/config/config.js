export const Config = {
    // Node counts for each level (excluding center)
    FIRST_LEVEL_NODES: 15,
    SECOND_LEVEL_NODES: 35,
    THIRD_LEVEL_NODES: 50,

    // Connection probabilities within same level (0-1)
    FIRST_LEVEL_DENSITY: 0.2,
    SECOND_LEVEL_DENSITY: 0.15,
    THIRD_LEVEL_DENSITY: 0.1,

    // Number of connections between levels
    SECOND_TO_FIRST_CONNECTIONS: 3,
    THIRD_TO_SECOND_CONNECTIONS: 5,

    // Maximum angle difference for same-level connections (in positions)
    FIRST_LEVEL_MAX_DISTANCE: 3,
    SECOND_LEVEL_MAX_DISTANCE: 4,
    THIRD_LEVEL_MAX_DISTANCE: 5,

    // Number of random walks to perform
    TOTAL_WALKS: 20,

    // Animation speed (ms)
    WALK_SPEED: 300,

    // Screen size and layout parameters
    MAIN_GRAPH_WIDTH_PERCENTAGE: 100,
    MAIN_GRAPH_HEIGHT_PERCENTAGE: 80,
    FINAL_GRAPH_WIDTH_PERCENTAGE: 20,
    FINAL_GRAPH_POSITION: {
        TOP: 150,
        RIGHT: 350
    },

    // Base dimensions for the graph
    BASE_WIDTH: 800,
    BASE_HEIGHT: 700,

    // Graph scaling
    NODE_RADIUS: {
        CENTER: 12,
        REGULAR: 9
    },
};