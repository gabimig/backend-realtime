/// <reference types="node" />
declare class RealTimeMonitor {
    metrics: {
        value: number;
        date: number;
    }[];
    maxpoints: number;
    timeout: NodeJS.Timeout | null;
    eventHandler: (() => void) | null;
    constructor(initpoints: number, maxpoints: number);
    initRealtimeGeneration(): void;
    stopRealtimeGeneration(): void;
}
export { RealTimeMonitor };
