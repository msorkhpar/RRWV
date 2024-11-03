import React, {useEffect} from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import useWalkLogic from './hooks/useWalkLogic';
import useGifRecorder from './hooks/useGifRecorder';
import generateGraphStructure from '../../utils/graphGenerator';
import calculateDimensions from '../../utils/dimensionCalculator';
import {Config} from '../../config/config';
import GraphVisualization from './GraphVisualization';

const RandomWalkVisualization = () => {
    const [graph] = React.useState(() => generateGraphStructure());
    const windowSize = useWindowSize();

    const {
        selectedNodes,
        selectedEdges,
        currentNode,
        walkCount,
        isWalking,
        startWalk,
        processNextStep,
        setIsWalking
    } = useWalkLogic(graph);

    const {
        containerRef,
        isRecording,
        isProcessing,
        startRecording,
        captureFrame,
        stopRecording,
    } = useGifRecorder();

    const dimensions = calculateDimensions(windowSize);
    useEffect(() => {
        if (!isWalking || walkCount >= Config.TOTAL_WALKS) {
            setIsWalking(false);
            if (isRecording) {
                stopRecording(); // Add this call
            }
            return;
        }

        const timer = setTimeout(async () => {
            if (isRecording) {
                await captureFrame();
            }
            processNextStep();
        }, Config.WALK_SPEED);

        return () => clearTimeout(timer);
    }, [isWalking, walkCount, isRecording, processNextStep, captureFrame, setIsWalking, stopRecording]);


    const handleStartWalk = () => {
        startWalk();
    };

    const handleStartRecording = () => {
        startRecording();
        startWalk();
    };

    return (
        <div className="w-full h-screen p-4 bg-gray-100">
            <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center bg-white"
            >
                {/* Main Graph */}
                <GraphVisualization
                    graph={graph}
                    selectedNodes={selectedNodes}
                    selectedEdges={selectedEdges}
                    currentNode={currentNode}
                    width={dimensions.mainWidth}
                    height={dimensions.mainHeight}
                    scale={1}
                />

                {/* Final Graph */}
                <GraphVisualization
                    graph={graph}
                    selectedNodes={selectedNodes}
                    selectedEdges={selectedEdges}
                    currentNode={currentNode}
                    isOriginal={false}
                    width={dimensions.finalWidth}
                    height={dimensions.finalHeight}
                    scale={1}
                />

                {/* Control Buttons */}
                <div className="fixed bottom-4 right-4 flex gap-2">
                    <button
                        onClick={handleStartWalk}
                        disabled={isWalking || isRecording || isProcessing}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Start Random Walk
                    </button>
                    <button
                        onClick={handleStartRecording}
                        disabled={isWalking || isRecording || isProcessing}
                        className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
                    >
                        {isProcessing ? 'Processing GIF...' : 'Record GIF'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RandomWalkVisualization;