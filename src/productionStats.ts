const minTimeLapse = 60000
const maxProductA = 100000
const maxProductB = 1000

class ProductionMonitor {

    production: {name: string, weight: number}[]
    productA: number
    productB: number
    maxProducts: number = 8
    timeout: NodeJS.Timeout | null
    eventHandler: (() => void )| null
    
    constructor() {
        this.production = []
        this.productA = 0
        this.productB = 0
        this.timeout = null
        this.eventHandler = null

        const points = 4

        for(let i = 0; i < points; i++) {
            this.production.push(this.newRandomProduct())
        }
    }

    private newRandomProduct() {
        const typePro = Math.floor(Math.random() * 2)
        if (typePro) {
            const numericName = ("00000" + this.productA).slice(-5)
            this.productA = (this.productA + 1) % maxProductA
            const name = `CF${numericName}`
            const weight = Math.floor(Math.random() * 150)
            return { name, weight }
        } else {
            const numericName = ("000" + this.productB).slice(-3)
            this.productB = (this.productB + 1) % maxProductB
            const name = `X${numericName}`
            const weight = Math.floor(Math.random() * 95)
            return { name, weight }
        }
    }

    initProductionGeneration() {
        const timelapse = Math.floor(Math.random() * minTimeLapse) + 5000
        this.timeout = setTimeout(() => {

            if (this.production.length == this.maxProducts) {
                this.production = this.production.slice(1, this.maxProducts)
            }
            this.production.push(this.newRandomProduct())
            
            if (this.eventHandler) {
                this.eventHandler()
            }
            this.initProductionGeneration()
        }, timelapse)
    }

    stopProductionGeneration () {
        if (this.timeout){
            clearTimeout(this.timeout)
            this.timeout = null
        }
    }
}

export { ProductionMonitor }
