import mapboxgl from 'mapbox-gl'
import React, { Component } from 'react';
import ReactDOM from 'react-dom'
//import geojson from 'geojson'
export default class MapFunctions extends Component {

    // set to 2017 initially despite play preview or you get a bug when using the type dropdown
    m_filterStartYear = ['<=', ['number', ['get', 'yearStart']], this.props.activeYear]
    m_filterEndYear = ['>=', ['number', ['get', 'yearEnd']], this.props.activeYear]
    m_filterType = ['!=', ['string', ['get', 'type']], 'placeholder']
    m_initiated = false
    map = null

    app = null
    tooltipContainer
    popup
    self = null
    grump = null
    m_colors = {
        "Coal": "#ced1cc",
        "Storage": "#4e80e5",
        "Solar": "#ffc83e",
        "Nuclear": "#dd54b6",
        "Oil": "#a45edb",
        "Hydro": "#43cfef",
        "Wave & Tidal": "#43cfef",
        "Wind": "#00a98e",
        "Biomass": "#A7B734",
        "Waste": "#ea545c",
        "Gas": "#cc9b7a",
    }

    state = {

        currentYear: this.props.activeYear,
        rawtypes: this.props.types
    }


    init() {
        if (!this.m_initiated) {
            mapboxgl.accessToken = "pk.eyJ1Ijoibm9yYWhhbWEiLCJhIjoiY2ptaGFsZDR5MThrczN1dDhtajc1cTFmMSJ9.VEUImGmfsM77LfjErYxDdQ"
            this.map = new mapboxgl.Map({
                container: "map",
                style: "mapbox://styles/mapbox/streets-v9",
                zoom: [5.5],
                center: [0, 55.3781]
            })

            // const filterType = ['!=', ['string', ['get', 'technology']], 'Battery (Discharging)'];
            var geojsondata = this.props.data;//geojson.parse(data, {Point: ['latitude','longitude']})
            // console.log(geojsondata)
            this.map.on('load', () => {
                //  this.m_filterStartYear = ['<=', ['number', ['get', 'yearStart']], 2000];
                //  this.m_filterEndYear = ['>=', ['number', ['get', 'yearEnd']], 2000];
                //  this.m_filterType = ['!=', ['string', ['get', 'type']], 'placeholder'];
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
            var self = this
            
            const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
                offset: [-120, 0]
              }).setLngLat([0,0]).addTo(this.map);

            this.map.on('mouseenter', 'powerplants', function (e) {
                // Change the cursor style as a UI indicator.
                console.log("enter: " + e.features[0].properties.site)
                tooltip.setLngLat(e.lngLat);
                self.grump = e.features[0]
                self.map.getCanvas().style.cursor = 'pointer';
                self.testFunction(true)

            })

            this.map.on('mousemove', 'powerplants', function (e) {
                tooltip.setLngLat(e.lngLat);
                self.grump = e.features[0]
                self.map.getCanvas().style.cursor = 'pointer';
                self.testFunction(true)

            })

            this.map.on('mouseleave', 'powerplants', function (e) {
         
                self.map.getCanvas().style.cursor = '';
                self.testFunction(false)
            });
            // Change the cursor style as a UI indicator.
            this.map.getCanvas().style.cursor = 'pointer';
            this.m_initiated = true;
        }

    }

    setTooltip(show, color, name, capacity, lowCarbon, operator, open, fuel, chp) {
        if (show) {

            ReactDOM.render(
                React.createElement(
                    PopupContent, {
                    color, name, capacity, lowCarbon, operator, open, fuel, chp
                }
                ),
                this.tooltipContainer
            )
        } else {

            ReactDOM.unmountComponentAtNode(this.tooltipContainer)
        }
    }

    componentDidUpdate(prevState) {

        //   console.log(this.props.filter)
        if (this.props.activeYear !== this.state.currentYear) {
            console.log("new year: " + this.props.activeYear)
            this.setState({
                currentYear: this.props.activeYear,
                m_filterStartYear: ['<=', ['number', ['get', 'yearStart']], this.props.activeYear],
                m_filterEndYear: ['>=', ['number', ['get', 'yearEnd']], this.props.activeYear]
            })
            this.updateFilters()
        }
        if (this.props.types !== this.state.rawtypes) {
            this.m_filterType = ["any"]
            //create the filter syntax fromthe actionFilter provided
            for (var i = 0; i < this.props.types.length; i++) {
                if (this.props.types[i].active)
                    this.m_filterType.push(["==", ["get", "type"], this.props.types[i].type])
            }

            this.setState({

                rawtypes: this.props.types
            })
            this.updateFilters()
        }
        this.init()
    }
    componentDidMount() {
        this.tooltipContainer = document.createElement('div');
        this.init()
    }
    testFunction(show) {

        var o = this.grump
        var name = o.properties.site;
        var capacity = o.properties.capacity;
        var type = o.properties.type;
        var fuelDetail = o.properties.fuelDetail;
        var lowCarbon = o.properties.lowCarbon;
        var operator = o.properties.operator;
        var chp = o.properties.chp;
        var open = o.properties.yearOpen;
        var plantColor = this.m_colors[o.properties.type];

        this.setTooltip(show,plantColor, name,capacity,lowCarbon,operator,open,this.getFuel(type,fuelDetail),chp)
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears over the copy being pointed to.
        //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        // }

        // Populate the popup and set its coordinates
        // based on the feature found.
      //  this.popup.setLngLat(coordinates)
      //      .setHTML(<PopupContent color={plantColor} name={name} capacity={this.roundToOne(capacity)} lowCarbon={lowCarbon} operator={operator} open={open} fuel={this.getFuel(type, fuelDetail)} chp={chp} />)
      //      .addTo(this.map);
    }

    setFilterType(filtertype) {
        if (this.map.isStyleLoaded()) {
            this.m_filterType = ["all", ["==", ["get", "type"], filtertype]]
            this.updateFilters()
        }
    }

    updateFilters() {
        if (this.map.isStyleLoaded()) {
            // map.setFilter('powerplants', ['all', filterOperator, filterType, filterStartYear, filterEndYear, filterSite, filterCapacity]);
            this.map.setFilter('powerplants', ['all', this.m_filterStartYear, this.m_filterEndYear, this.m_filterType])
        }
    }

    getFuel = (type, fuelDetail) => {
        if (fuelDetail === "-") {
            return type
        } else if (type === "Wind" || type === "Hydro") {
            return fuelDetail
        } else {
            return type + ", " + fuelDetail
        }
    }

    roundToOne = (capacity) => {
        return +(Math.round(capacity + "e+1") + "e-1");
    }

    render() {
        return (

            <div style={{ height: this.props.height }} ref={el => this.mapContainer = el} className="mapContainer topDistance" id="map" />

        )
    }

}
const PopupContent = ({ color, name, capacity, lowCarbon, operator, open, fuel, chp }) => (
    <div className={`colour-key popupDiv`}>
        <h3 className="popupHeading" style={{ color: color }}> {name}</h3>
        <div className="popupInfo" style={{ 'backgroundColor': color }} >
            <p className="inline">{fuel}</p>
            <p><span className="label-title">Capacity: </span>{capacity}<span className="units">MW</span></p>
            <p><span className="label-title">Low carbon? </span>{lowCarbon}</p>{chp !== "-" ? <p><span className="label-title">Combined heat and power?</span>{chp}</p> : ""}
            <p><span className="label-title">Operator: </span> {operator}</p>
            <p><span className="label-title">Year opened: </span> {open} </p>
        </div>
    </div>
)

