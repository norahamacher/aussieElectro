import mapboxgl from 'mapbox-gl'
import geojson from 'geojson'
export default class MapFunctions {

    // set to 2017 initially despite play preview or you get a bug when using the type dropdown
    map = null
    constructor(data, container) {
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
            console.log("on load...")
            var filterStartYear = ['<=', ['number', ['get', 'yearStart']], 2008];
            var filterEndYear = ['>=', ['number', ['get', 'yearEnd']], 2008];
            var filterType = ['!=', ['string', ['get','type']], 'placeholder'];
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
                'filter': ['all', filterStartYear, filterEndYear, filterType]
            });
        })
    }

    setFilterType(filtertype) {
        if (this.map.isStyleLoaded()) {
            const filterType = ["all", ["==", ["get", "type"], filtertype]]
            this.map.setFilter('powerplants', ['all', filterType])
        }
    }

    setFilterYearStart(year) {
        console.log(year)
        if (this.map.isStyleLoaded()) {
            var filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
            this.map.setFilter('powerplants', ['all', filterStartYear])
        }
    }

    setFilterYearEnd(year) {
        if (this.map.isStyleLoaded()) {
            var filterEndYear = ['>=', ['number', ['get', 'yearEnd']], year];
            this.map.setFilter('powerplants', ['all', filterEndYear])
        }
    }

    setFilterStartEnd(year){
        if (this.map.isStyleLoaded()) {
            var filterEndYear = ['>=', ['number', ['get', 'yearEnd']], year];
            var filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
            this.map.setFilter('powerplants', ['all', filterEndYear,filterStartYear])
        }
    }
}