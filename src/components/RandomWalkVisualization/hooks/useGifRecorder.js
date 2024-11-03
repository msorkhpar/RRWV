import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import GIF from 'gif.js';
import { Config } from '../../../config/config';

const useGifRecorder = () => {
    const containerRef = useRef(null);
    const frames = useRef([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const captureFrame = async () => {
        if (containerRef.current) {
            try {
                const dataUrl = await toPng(containerRef.current, {
                    quality: 1.0,
                    backgroundColor: 'white'
                });
                frames.current.push(dataUrl);
            } catch (error) {
                console.error('Error capturing frame:', error);
            }
        }
    };

    const createAndDownloadGif = async () => {
        console.log('Starting GIF creation with frames:', frames.current.length);
        if (frames.current.length === 0) {
            console.warn('No frames to create GIF');
            setIsProcessing(false);
            setIsRecording(false);
            return;
        }

        setIsProcessing(true);

        try {
            // Create new GIF
            const gif = new GIF({
                workers: 2,
                quality: 10,
                width: containerRef.current?.offsetWidth || 800,
                height: containerRef.current?.offsetHeight || 600,
                workerScript: '/gif.worker.js'
            });

            console.log('GIF object created, loading frames...');

            // Load all images first
            const frameImages = await Promise.all(
                frames.current.map((frame, index) => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => {
                            resolve(img);
                        };
                        img.onerror = (e) => {
                            console.error(`Frame ${index + 1} failed to load:`, e);
                            reject(e);
                        };
                        img.src = frame;
                    });
                })
            );


            // Add frames to GIF
            frameImages.forEach((image, index) => {
                gif.addFrame(image, { delay: Config.WALK_SPEED });
            });

            // Add event handlers
            gif.on('progress', (p) => {
                console.log('GIF generation progress:', Math.round(p * 100), '%');
            });

            gif.on('finished', (blob) => {
                console.log('GIF generation finished, creating download...');
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'random-walk.gif';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                // Reset states
                frames.current = [];
                setIsProcessing(false);
                setIsRecording(false);
                console.log('GIF process completed and states reset');
            });

            gif.on('error', (error) => {
                console.error('Error in GIF generation:', error);
                setIsProcessing(false);
                setIsRecording(false);
            });

            gif.render();

        } catch (error) {
            console.error('Error in createAndDownloadGif:', error);
            setIsProcessing(false);
            setIsRecording(false);
        }
    };

    const startRecording = () => {
        frames.current = [];
        setIsRecording(true);
    };

    const stopRecording = async () => {
        setIsRecording(false);
        if (frames.current.length > 0) {
            await createAndDownloadGif();
        }
    };

    return {
        containerRef,
        isRecording,
        isProcessing,
        startRecording,
        stopRecording,
        captureFrame,
        setIsRecording,
        setIsProcessing
    };
};

export default useGifRecorder;