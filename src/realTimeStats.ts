class RealTimeMonitor {
    metrics: {value: number, date: Date}[]
    maxpoints: number
    timeout: NodeJS.Timeout | null
    eventHandler: (() => void )| null
    
    constructor(initpoints: number, maxpoints: number) {
        this.metrics = []
        this.maxpoints = maxpoints
        this.timeout = null
        this.eventHandler = null

        const points = initpoints <= maxpoints? initpoints: maxpoints
        const date = new Date()
        date.setSeconds(date.getSeconds() - points)

        for(let i = 0; i < points; i++) {
            const value = Math.floor(Math.random() * 80) + 100
            date.setSeconds(date.getSeconds() + i)
            this.metrics.push({value, date})
        }
    }

    initRealtimeGeneration() {
        const timelapse = Math.floor(Math.random() * 1000) + 1000
        this.timeout = setTimeout(() => {
            const value = Math.floor(Math.random() * 80) + 100
            const date = new Date()
            if (this.metrics.length == this.maxpoints) {
                this.metrics = this.metrics.slice(1, this.metrics.length)
            }
            this.metrics.push({value, date})
            if (this.eventHandler) {
                this.eventHandler()
            }
            this.initRealtimeGeneration()
        }, timelapse)
    }

    stopRealtimeGeneration () {
        if (this.timeout){
            clearTimeout(this.timeout)
            this.timeout = null
        }
    }
}

export { RealTimeMonitor }
