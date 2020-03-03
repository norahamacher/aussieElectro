import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import StoryPanel from './StoryPanel.js'
import * as d3 from 'd3'
import data from './facilities.csv';
import MapFunctions from './MapFunctions';


class ScrollyTeller extends Component {

    //  m_mapfilter = null;
    state = {
        alldata: [],
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
        d3.csv(data).then((data) => {
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

        })   
    }
    allPanels = []
    setActiveID = (id) => {
        this.setState({
            activeId: id
        })
        this.m_mapFunctions.setFilterType(this.state.sorteddata[id].title)
    }

    componentDidUpdate() {
        // console.log(this.state.alldata)

    }

    createPanelContent(parentIndex) {
        var contentItems = this.state.sorteddata[parentIndex].content
        var res = []
        for (var i = 0; i < contentItems.length; i++) {
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
    }
    render() {
        return (
            <div className="App">
                <div className="navbar">
                        {this.state.sorteddata.map(
                            (panel,i) =>
                            <NavMenuItem
                                key={i}
                                name={panel.title}
                            />
                         
                        )}
                    </div>
                <div className="MainContainer">                  
                    <div className="Panels" style={{height: this.state.panelHeight}}>
                        {this.state.sorteddata.map(
                            (panel, i) =>
                                //"Facility Name", "Status", "Region", "Technology", "Generator Capacity (MW)", "Latitude", "Longitude"

                                <StoryPanel
                                    key={i}
                                    id={i}
                                    app={this}
                                    activeID={this.state.activeId} //the Storypanels figure out if they are the active panel and display accordingly
                                    title={panel.title}
                                    content={this.createPanelContent(i)}
                                />
                        )}
                    </div>
                    <div style={{height: this.state.panelHeight}} ref={el => this.mapContainer = el} className="mapContainer" />
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
        <p> Capacity: {capacity}
        </p>
        <p>Region: {region}</p>
        <span>Latitude/Longitude: {latitude}/{longitude}</span>
    </div>
);

const NavMenuItem = ({name}) => (
   
    <a href={"#"+name} > {name} </a>
)
ReactDOM.render(<ScrollyTeller />, document.getElementById('root'));
