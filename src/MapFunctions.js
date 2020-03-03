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
            zoom: [3],
            center: [137.15, -40.5]
        })
       // const filterType = ['!=', ['string', ['get', 'technology']], 'Battery (Discharging)'];
        var geojsondata = geojson.parse(data, {Point: ['latitude','longitude']})
       // console.log(geojsondata)
        this.map.on('load', () => {
            console.log("on load...")
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
                        ['get', 'technology'],
                        "Black Coal", "#ced1cc",
                        "Battery (Discharging)", "#4e80e5",
                        "Hydro", "#ffc83e",
                        "Hydro,Pumps", "#ffc83e",
                        "Pumps", "#ffc83e",
                        "Biomass", "#dd54b6",
                        "Oil", "#a45edb",
                        "Brown Coal", "#43cfef",
                        "Distillate,Hydro", "#43cfef",
                        "Gas (CCGT)", "#00a98e",
                        "Gas (OCGT)", "#00a98e",
                        "Gas (Reciprocating)", "#00a98e",
                        "Gas (Steam)", "#00a98e",
                        "Gas (Waste Coal Mine)", "#00a98e",
                        "Bioenergy (Biomass)", "#A7B734",
                        "Distillate", "#ea545c",
                        "Bioenergy (Biogas)", "#cc9b7a",
                        "Solar (Utility)", "#ffd300",
                        "Solar (Utility),Wind", "#ffd300",
                        "Wind", "#0000FF",

            /* other */ '#ccc'
                    ],
                    'circle-opacity': 0.77
                },
                'filter':["all",["==", ["get","technology"], "Battery (Discharging)"]]
            });

        })
        
    }

    setFilterType(filtertype){
        if(this.map.isStyleLoaded()){
        const filterType = ["all",["==", ["get","technology"], filtertype]]
        this.map.setFilter('powerplants',['all', filterType])
        }
    }

}