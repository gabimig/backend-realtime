interface DataReport {
    name: string
    quality: string
    weight: number
    energy: number
    ini: number
    end: number
}

const quality = [
    'High', 'Medium', 'Low'
]

class ReportProxy {

    production: DataReport[]
    
    
    constructor(elements: number) {
        this.production = []
        const date = new Date()
        date.setHours(date.getHours() - elements)
        for(let i = 0; i < elements; i++) {
            const numericName = ("00000" + i).slice(-5)
            const ini = date.getTime()
            date.setHours(date.getHours() + 1)
            const end = date.getTime()
            const data: DataReport = {
                name: `FC${numericName}`,
                quality: quality[Math.floor(Math.random() * 3)],
                weight: Math.floor(Math.random() * 150),
                energy: Math.round(Math.random() * 150000)/100,
                ini,
                end,
            }
            this.production.push(data)
        }
    }

    find(minQuality: string = 'Low',
        ini: Date | undefined = undefined,
        end: Date | undefined = undefined,
        page: number = 0,
        rows: number = 10
    ) {
        const minIndex = page * rows
        const iniTime = ini?.getTime()
        const endTime = end?.getTime()
        const filtered = this.production.filter((p: DataReport) => {
            if (iniTime && p.ini < iniTime)
                return false
            if (endTime && p.ini > endTime)
                return false
            if (minQuality === 'Medium' && p.quality === 'Low' )
                return false
            if (minQuality === 'High' && p.quality !== 'High' )
                return false
            return true
        })

        const ret: any = {
            total: filtered.length,
            page,
            rows,
        }
        const result = filtered.slice(minIndex, minIndex + rows)
        ret.result = result

        return ret
    }

}

export { ReportProxy }
