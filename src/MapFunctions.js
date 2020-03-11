import mapboxgl from 'mapbox-gl'
//import geojson from 'geojson'
export default  class MapFunctions {

    // set to 2017 initially despite play preview or you get a bug when using the type dropdown
    m_filterStartYear = ""
    m_filterEndYear =""
    m_filterType = ""
    map = null

    instance
    constructor() {

        if(!!MapFunctions.instance){
            console.log("returning existing instance")
            return MapFunctions.instance
        }

        MapFunctions.instance = this
        console.log("returning new instance")
        return this
    }

    init(data, container){
        mapboxgl.accessToken = "pk.eyJ1Ijoibm9yYWhhbWEiLCJhIjoiY2ptaGFsZDR5MThrczN1dDhtajc1cTFmMSJ9.VEUImGmfsM77LfjErYxDdQ"
        this.map = new mapboxgl.Map({
            container: container,
            style: "mapbox://styles/mapbox/streets-v9",
            zoom: [5],
            center: [3.436,55.3781]
        })
        // const filterType = ['!=', ['string', ['get', 'technology']], 'Battery (Discharging)'];
        var geojsondata = data;//geojson.parse(data, {Point: ['latitude','longitude']})
        // console.log(geojsondata)
        this.map.on('load', () => {
            this.m_filterStartYear = ['<=', ['number', ['get', 'yearStart']], 2008];
            this.m_filterEndYear = ['>=', ['number', ['get', 'yearEnd']], 2008];
            this.m_filterType= ['!=', ['string', ['get','type']], 'placeholder'];
            this.map.addLayer({
                id: 'powerplants',
                type: 'circle',
                source: {
                    type: 'geojson',
                    data: geojsondata
                },
                paint: {
                    'circle-radius': {
                        property: 'capacity',
                        type: 'exponential',
                        base: 0.8,
                        stops: [
                            [{ zoom: 2, value: 1 }, 0.2],
                            [{ zoom: 2, value: 2500 }, 5],
                            [{ zoom: 4.5, value: 1 }, 2],
                            [{ zoom: 4.5, value: 2500 }, 21],
                            [{ zoom: 8, value: 1 }, 4],
                            [{ zoom: 8, value: 2500 }, 32],
                            [{ zoom: 12, value: 1 }, 6],
                            [{ zoom: 12, value: 2500 }, 37],
                            [{ zoom: 15, value: 1 }, 8],
                            [{ zoom: 15, value: 2500 }, 42]
                        ]
                    },
                    'circle-color': [
                        'match',
                        ['get', 'type'],
                        "Coal", "#ced1cc",
                        "Storage", "#4e80e5",
                        "Solar", "#ffc83e",
                        "Nuclear", "#dd54b6",
                        "Oil", "#a45edb",
                        "Hydro", "#43cfef",
                        "Wave & Tidal", "#43cfef",
                        "Wind", "#00a98e",
                        "Biomass", "#A7B734",
                        "Waste", "#ea545c",
                        "Gas", "#cc9b7a",
            /* other */ '#ccc'
                    ],
                    'circle-opacity': 0.77
                },
                'filter': ['all', this.m_filterStartYear, this.m_filterEndYear, this.m_filterType]
            });
        })
    }

    setFilterType(filtertype) {
        if (this.map.isStyleLoaded()) {
            this.m_filterType = ["all", ["==", ["get", "type"], filtertype ]]
            this.updateFilters()
        }
    }

    setFilterYearStart(year) {
        console.log(year)
        if (this.map.isStyleLoaded()) {
            this.m_filterStartYear = ['<=', ['number', ['get', 'yearStart']], year]
            this.updateFilters()
        }
    }

    setFilterYearEnd(year) {
        if (this.map.isStyleLoaded()) {
            this.m_filterEndYear = ['>=', ['number', ['get', 'yearEnd']], year]
            this.updateFilters()
        }
    }

    setFilterStartEnd(year){
        if (this.map.isStyleLoaded()) {
            this.m_filterEndYear = ['>=', ['number', ['get', 'yearEnd']],  year]
            this.m_filterStartYear = ['<=', ['number', ['get', 'yearStart']], year]
            this.updateFilters()
        }
    }

    setFilterTypeString(arr){
        if (this.map.isStyleLoaded()) {
            this.m_filterType=arr
            this.updateFilters()
        }
    }
    
    showAllTypes(){
        if (this.map.isStyleLoaded()) {
            this.m_filterType=['!=', ['string', ['get','type']], 'placeholder'];
            this.updateFilters()
        }
    }
    updateFilters(){
       // map.setFilter('powerplants', ['all', filterOperator, filterType, filterStartYear, filterEndYear, filterSite, filterCapacity]);
        this.map.setFilter('powerplants', ['all', this.m_filterStartYear,this.m_filterEndYear, this.m_filterType])
  
    }
}