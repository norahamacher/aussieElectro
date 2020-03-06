import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import StoryPanel from './StoryPanel.js'
import * as d3 from 'd3'
import data from './facilities.csv';
import data2 from './ukdata/power_stations.json'
import MapFunctions from './MapFunctions';
import { json } from 'd3';


class ScrollyTeller extends Component {

    //  m_mapfilter = null;
    state = {
        years: [2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020],
        sorteddata: [],
        activeId: 0,
        panelHeight:700
    }
    panelChanged = false
    m_mapFunctions = null
    //"Facility Name", "Status", "Region", "Technology", "Generator Capacity (MW)", "Latitude", "Longitude"

    componentDidMount = function () {
        //adjust height
        this.setState({panelHeight: window.innerHeight-130})
        
        this.m_mapFunctions = new MapFunctions(data2,this.mapContainer)
        this.setState({alldata:data2})
        
     /*   d3.json(data2).then((data2) => {
            this.setState({
                alldata:data2
            })
            console.log(data2)
        })
       */ 
        /*d3.csv(data).then((data) => {
            this.setState({
                alldata: data
            })
            //"Facility Name", "Status", "Region", "Technology", "Generator Capacity (MW)", "Latitude", "Longitude"
            var i
            var item
            var currTech = "Fitzlibutzli"
            console.log(data)
            for (i = 0; i < data.length; i++) {
                item = data[i]
                if (item.technology !== currTech) {
                    this.allPanels.push({ content: [], title: item.technology })
                    this.allPanels[this.allPanels.length - 1].content.push(item)
                    currTech = item.technology
                } else {
                    this.allPanels[this.allPanels.length - 1].content.push(item)
                }

            }
            console.log(this.allPanels);
            this.m_mapFunctions = new MapFunctions(data,this.mapContainer)
            this.setState({
                sorteddata: this.allPanels
            })

        })   */
    }
    allPanels = []
    setActiveID = (id) => {
        this.setState({
            activeId: id
        })
        //this.m_mapFunctions.setFilterYearStart(this.state.years[id])
        this.m_mapFunctions.setFilterStartEnd(this.state.years[id])

        //in each year i want to display plants that HAVE STARTED but NOT YET ENDED
    }

    componentDidUpdate() {
        // console.log(this.state.alldata)

    }

    createPanelContent(year) {
     /*   var contentItems = this.state.sorteddata[parentIndex].content
        var res = []
        for (var i = 0; i < this.state.years.length; i++) {
            var info = contentItems[i]
            res.push(<PanelContent
                key={i}
                name={info.facility}
                status={info.status}
                region={info.region}
                capacity={info.generatorcap}
                latitude={info.latitude}
                longitude={info.longitude}
            />)
        }
        return res;
        */
       //read the text from somewhere based on the given year
       return <PanelContent name={year} status={"this will be proper content at some point. this will be proper content at some point. this will be proper content at some point .this will be proper content at some pointthis will be proper content at some pointthis will be proper content at some pointthis will be proper content at some pointthis will be proper content at some pointthis will be proper content at some pointthis will be proper content at some point"}></PanelContent>

    }
    render() {
        return (
            <div className="App">
                <div className="navbar">
                        {this.state.years.map(
                            (year,i) =>
                            <NavMenuItem
                                key={i}
                                name={year}
                            />
                        )}
                    </div>
                <div className="MainContainer">                  
                    <div className="Panels" style={{height: this.state.panelHeight}}>
                        <div id="text-mask-wrapper" className="sticky">
                            <div id="text-mask"></div>
                        </div>
                        {this.state.years.map(
                            (year, i) =>
                                //"Facility Name", "Status", "Region", "Technology", "Generator Capacity (MW)", "Latitude", "Longitude"

                                <StoryPanel
                                    key={i}
                                    id={i}
                                    app={this}
                                    activeID={this.state.activeId} //the Storypanels figure out if they are the active panel and display accordingly
                                    title={year}
                                    content={this.createPanelContent(year)}
                                />
                        )}
                    </div>
                    <div style={{height: this.state.panelHeight}} ref={el => this.mapContainer = el} className="mapContainer" id="map"/>
                </div>
              
            </div>
        );
    }
}

//"Facility Name", "Status", "Region", "Technology", "Generator Capacity (MW)", "Latitude", "Longitude"
const PanelContent = ({ name, status, region, capacity, latitude, longitude }) => (
    <div className="panelContentFragment">
        <h3>{name}</h3>
        <p> Status: {status} </p>     
    </div>
);

const NavMenuItem = ({name}) => (
   
    <a href={"#"+name} > {name} </a>
)
ReactDOM.render(<ScrollyTeller />, document.getElementById('root'));
