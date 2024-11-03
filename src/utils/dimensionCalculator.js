import {Config} from '../config/config';

const calculateDimensions = (windowSize) => {
    const mainWidth = Math.min(
        (windowSize.width * Config.MAIN_GRAPH_WIDTH_PERCENTAGE) / 100,
        windowSize.width - 40
    );
    const mainHeight = Math.min(
        (windowSize.height * Config.MAIN_GRAPH_HEIGHT_PERCENTAGE) / 100,
        windowSize.height - 40
    );

    const finalWidth = (windowSize.width * Config.FINAL_GRAPH_WIDTH_PERCENTAGE) / 100;
    const finalHeight = (finalWidth * Config.BASE_HEIGHT) / Config.BASE_WIDTH;

    return {
        mainWidth,
        mainHeight,
        finalWidth,
        finalHeight
    };
};
export default calculateDimensions;