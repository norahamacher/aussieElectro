import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import './css/responsive.css'
//import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import StoryPanel from './StoryPanel.js'
//import * as d3 from 'd3'
import dataCoal from './AUSdata/powerStations_coal.json'
import dataSolar from './AUSdata/powerStations_solar.json'
import currentData from "./AUSdata/facility_registry.json"
import MapFunctions from './MapFunctions';
import sectiondata from './playdata/sections.json'
import ScrollIntoView from 'react-scroll-into-view'
import Stackedbarchart from './stacked-bar.js'

import *  as d3 from 'd3'
import stackedData from './AUSdata/yearDistribution.csv'
class ScrollyTeller extends Component {


    m_debug= true
    m_percentageCalcs = []
    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight, panelHeight: window.innerHeight - 100 });

    };
  
    //  m_mapfilter = null;
    state = {
        sections: [],
        width: 0,
        height: 0,
        //the years should be read from a file with their corresponding html content
        // sorteddata: [],
        activeId: 0,
        panelHeight: 800,
        types: [{ "type": "Coal", "active": true },
        { "type": "Solar", "active": true },
        { "type": "Solar2", "active": true },
        { "type": "Hydro", "active": true },
        { "type": "Waste", "active": true },
        { "type": "Storage", "active": true },
        { "type": "Wind", "active": true },
        { "type": "Gas", "active": true }],

        percentages: [
            { "type": "Coal", "percentage": 45 },
            { "type": "Solar", "percentage": 20 },
            { "type": "Solar2", "percentage": 10 },
            { "type": "Hydro", "percentage": 5 },
            { "type": "Waste", "percentage": 5 },
            { "type": "Wind", "percentage": 5 },
            { "type": "Gas", "percentage": 15 }
        ]
    }
    panelChanged = false
    // m_mapFunctions = null
    //"Facility Name", "Status", "Region", "Technology", "Generator Capacity (MW)", "Latitude", "Longitude"


    GetNewPercentages = (year) => {
        console.log(year)
       
        if (year < this.m_percentageCalcs[0].year || year === undefined) {

               return this.m_percentageCalcs[0].vals
          
        } else if (year> this.m_percentageCalcs[this.m_percentageCalcs.length - 1].year) {
            
            return    this.m_percentageCalcs[this.m_percentageCalcs.length - 1].vals
           
        } else {
                var i=0
                while(this.m_percentageCalcs[i].year < year){
       
                    i++
                }
                console.log(this.m_percentageCalcs[i].vals)
                return  this.m_percentageCalcs[i].vals      
        }
    
    }

    prepPercentages = (data) => {
      //  console.log(data)
        //m_percentageCalcs
        /*0: {Year: "1989", Coal: "121167.00", Solar: "", Solar2: "", Hydro: "14880.00", …}
1: {Year: "1990", Coal: "125559.00", Solar: "", Solar2: "", Hydro: "16103.00", …}
2: {Year: "1991", Coal: "128884.10", Solar: "10.90", Solar2: "", Hydro: "15768.00", …}
3: {Year: "1992", Coal: "131120.70", Solar: "13.30", Solar2: "", Hydro: "16953.00", …}
4: {Year: "1993", Coal: "135434.10", Solar: "15.90", Solar2: "", Hydro: "16649.00", …}
5: {Year: "1994", Coal: "138354.10", Solar: "18.90", Solar2: "", Hydro: "16239.00", …}*/
        var row, sum
        var arr = []
        for (var i = 0; i < data.length; i++) {
            arr = []
            sum = 0
            row = data[i]
            row.Coal = parseFloat(row.Coal)
            row.Solar = parseFloat(row.Solar)
            row.Solar2 = parseFloat(row.Solar2)
            row.Gas = parseFloat(row.Gas)
            row.Waste = parseFloat(row.Waste)
            row.Hydro = parseFloat(row.Hydro)
            row.Wind = parseFloat(row.Wind)
            if (!isNaN(row.Coal)) {
                sum += row.Coal
            }
            if (!isNaN(row.Solar)) {
                sum += row.Solar
            }
            if (!isNaN(row.Solar2)) {
                sum += row.Solar2
            }
            if (!isNaN(row.Gas)) {
                sum += row.Gas
            }
            if (!isNaN(row.Waste)) {
                sum += row.Waste
            }
            if (!isNaN(row.Hydro)) {
                sum += row.Hydro
            }
            if (!isNaN(row.Wind)) {
                sum += row.Wind
            }
         //   console.log(row)
            // sum = parseFloat(row.Coal) + parseFloat(row.Solar) + parseFloat(row.Solar2) + parseFloat(row.Hydro) + parseFloat(row.Gas) + parseFloat(row.Waste) + parseFloat(row.Wind)

            arr.push({ "type": "Coal", "percentage": +parseFloat( (row.Coal) / sum * 100 ).toFixed(2)})
            arr.push({ "type": "Solar", "percentage": +parseFloat((row.Solar) / sum * 100).toFixed(2) })
            arr.push({ "type": "Solar2", "percentage": +parseFloat((row.Solar2) / sum * 100).toFixed(2) })
            arr.push({ "type": "Hydro", "percentage": +parseFloat((row.Hydro) / sum * 100).toFixed(2) })
            arr.push({ "type": "Waste", "percentage": +parseFloat((row.Waste) / sum * 100).toFixed(2) })
            arr.push({ "type": "Wind", "percentage": +parseFloat((row.Wind) / sum * 100 ).toFixed(2)})
            arr.push({ "type": "Gas", "percentage": +parseFloat((row.Gas) / sum * 100).toFixed(2) })
          
            this.m_percentageCalcs.push({ "year": parseFloat(row.Year), vals: arr })
        }
       // console.log(this.m_percentageCalcs)
       // this.updatePercentages(1960)
       this.setState({
           
        percentages: this.GetNewPercentages( this.state.sections[0].year)
        
    })
    }

    UNSAFE_componentWillMount = function () {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions()

        d3.csv(stackedData).then(this.prepPercentages);

        /* make solar not disappear because of dataset...*/
        var postcode = "";
        var i
        for( i = 0; i <dataSolar.features.length; i ++){
            var obj = dataSolar.features[i]
            if ( obj.properties.site !== postcode) {
                if(i>0){
                    dataSolar.features[i-1].properties.yearEnd=9999
                }
                postcode = obj.properties.site
            } 
           
        }
        
        for ( i = 0; i < sectiondata.sections.length; i++) {
            sectiondata.sections[i].renderparagraphs = this.createPanelContent(sectiondata.sections[i].year, sectiondata.sections[i].paragraphs)
            //     console.log(sectiondata.sections[i].renderparagraphs)
        }
        //  console.log(sectiondata.sections[4].renderparagraphs)
        //read the content from file.
        this.setState({
            sections: sectiondata.sections
        })

        //  console.log(sectiondata.sections)
        var val;
        for (var j = 0; j < dataSolar.features.length; j++) {

             val = dataSolar.features[j].properties.capacity;
            if(val > 15000 ){
                dataSolar.features[j].properties.gValue = 20
            } else if( val < 200) {
                dataSolar.features[j].properties.gValue = 200;
            } else {
               
                dataSolar.features[j].properties.gValue =  300 - (Math.trunc((val - 200) * (200 - 50)/(15000-200) + 50))
           //     console.log(dataSolar.features[j].properties.capacity);
                
            }
            dataSolar.features[j].properties.capacity = (dataSolar.features[j].properties.capacity /= 1000).toFixed(2);
           

        }

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }
    allPanels = []
    setActiveID = (id) => {
        this.setState({
            activeId: id,
       
            
        })

        if(this.m_percentageCalcs!==undefined && this.m_percentageCalcs.length > 0){
            this.setState({
           
                percentages: this.GetNewPercentages( this.state.sections[id].year)
                
            })
        }
      //  this.updatePercentages(this.state.sections[id].year)
        //this.m_mapFunctions.setFilterYearStart(this.state.years[id])
        //   this.m_mapFunctions.setFilterStartEnd(this.state.sections[id].year)

        //  this.updatePercentages()
        //in each year i want to display plants that HAVE STARTED but NOT YET ENDED
    }

    createPanelContent(year, paragraphs) {

        //read the text from somewhere based on the given year
        var result = [];
        var filter = "";
        var key = ""
        for (var i = 0; i < paragraphs.length; i++) {
            key = year + "_" + i
            //check for features like links, if its a link, replace the "text" with a hyperlinnk to the "url"
            if (paragraphs[i].features) {
                for (var j = 0; j < paragraphs[i].features.length; j++) {
                    var feature = paragraphs[i].features[j]
                    if (feature.type === "link") {
                        paragraphs[i].text = paragraphs[i].text.replace(feature.text, '<a href="' + feature.url + '" target="_blank">' + feature.text + '</a>')
                        //                console.log(paragraphs[i].text)
                    }
                }
            }
            //if actions aredefined, they are added to the element here.
            if (paragraphs[i].actions) {
                for (j = 0; j < paragraphs[i].actions.length; j++) {
                    var action = paragraphs[i].actions[j]
                    if (action.highlight) {
                        if (action.highlight.type === "type") {
                            filter = {

                                "action": this.setActiveMulti,
                                "objects": []
                            }
                        } else if (action.highlight.type === "plant") {
                            filter = {

                                "action": this.setActiveName,
                                "objects": []
                            }
                        }
                        //highlight means highlight the words in the text with a class of the same name, and filter things on the map of this name
                        for (var k = 0; k < action.highlight.keywords.length; k++) {
                            paragraphs[i].text = paragraphs[i].text.replace(action.highlight.keywords[k], "<span class='" + action.highlight.keywords[k] + "'>" + action.highlight.keywords[k] + "</span>")
                            filter.objects.push(this.cap(action.highlight.keywords[k]))

                            //capitalise first letter otherwise the filter breaks 
                        }
                    }
                }
            }

            result.push(
                <div content={paragraphs[i]} id={key} actionFilter={filter} />
            )
        }
        // console.log(result)
        return result

    }

    //gets called from child components or when the user clicked the type nav menu. updates state of that menu accordingly, also when a scrolltrigger (de)activated a type
    setActiveMulti = (types) => {

        var arr = null
        if (types === null) {
            arr = [{ "type": "Coal", "active": true },
            { "type": "Gas", "active": true },
            { "type": "Hydro", "active": true },
            { "type": "Wind", "active": true },
            { "type": "Waste", "active": true },
            { "type": "Solar", "active": true },
            { "type": "Solar2", "active": true }]

        } else {
            arr = [{ "type": "Coal", "active": false },
            { "type": "Gas", "active": false },
            { "type": "Hydro", "active": false },
            { "type": "Wind", "active": false },
            { "type": "Waste", "active": false },
            { "type": "Solar", "active": false },
            { "type": "Solar2", "active": true }]
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < types.length; j++) {
                    if (arr[i].type === types[j]) {
                        arr[i].active = true
                        break;
                    }
                }
            }

        }
        this.setState({
            types: arr
        })
    }

    setActive = (ttype, active) => {
        //  console.log(index)
        this.setState(state => {
            const types = state.types.map((type, i) => {
                if (type === ttype) {
                    return { "type": type.type, "active": active }
                } else {
                    return type;
                }
            });
            return {
                types
            };
        })
    }

    setActiveName = (name) => {

    }
    toggleActive = (ttype) => {
       // console.log(ttype)
        this.setState(state => {
            const types = state.types.map((type) => {
                if (type.type === ttype) {
                    return { "type": type.type, "active": !type.active }
                } else {
                    return type;
                }
            });
            return {
                types
            };
        })
    }
    //capitalise the first letter of  string
    cap(lower) {
        return lower.replace(/^\w/, c => c.toUpperCase());
    }
    render() {
        return (
            <div className="App">
                <div className="navbar" id="yearNav">
                    {this.state.sections.map(
                        (section, i) =>
                            <NavMenuItem
                                key={i}
                                id={i}
                                name={section.year}
                                activeId={this.state.activeId}
                            />
                    )}
                </div>
                <div className="navbar navbar_right" id="typeNav">
                    <span className="typeSelectionLabel">Type selection</span>
                    {this.state.types.map(
                        (type, i) =>
                            <NavMenuTypeItem
                                key={i}
                                onClickA={this.toggleActive}
                                type={type.type}
                                active={type.active}
                            />
                    )}
                </div>
                <div className="MainContainer">
                    {/*  <StackedBar  percentages={this.state.percentages} height={this.state.panelHeight}/>--> */}
                    <div className="Panels topDistance" style={{ height: this.state.panelHeight }}>

                        {this.state.sections.map(
                            (section, i) =>

                                <StoryPanel
                                    key={i}
                                    id={i}
                                    app={this}
                                    activeID={this.state.activeId} //the Storypanels figure out if they are the active panel and display accordingly
                                    title={section.year}
                                    anchorname={"section" + section.year}
                                    paragraphs={section.renderparagraphs}
                                />
                        )}
                    </div>
                    <StackedBar height={this.state.panelHeight-70} percentages={this.state.percentages} />
                    <MapFunctions types={this.state.types} coalData={dataCoal} debug={ this.m_debug} currentData={currentData} solarData={dataSolar} height={this.state.panelHeight} activeYear={this.state.sections !== undefined ? this.state.sections[this.state.activeId].year : "1950"} />

                </div>
            </div>
        );
    }
}


class NavMenuTypeItem extends Component {
    handleClick = () => {
        this.props.onClickA(this.props.type);
    }

    render() {
        return (
            <div onClick={this.handleClick} className={`navItem navItemColor ${this.props.active ? "navItemActive_" + this.props.type : ""}`}> {this.props.type} </div>

        );
    }
}

class StackedBar extends Component {
    render() {
        return (
            <div className="mapBorder" style={{ height: this.props.height }} id="stackedBar">
                <Stackedbarchart percentages={this.props.percentages} width={85} height={this.props.height} /> 
            </div>
        )
    }
}
const NavMenuItem = ({ id, name, activeId }) => (

    <ScrollIntoView
        selector={`#section${name}_id_p0`}
        alignToTop={false} >
        <div className={`navItem ${id === activeId ? "navItemActive" : ""} `}> {name} </div>
    </ScrollIntoView>
)
ReactDOM.render(<ScrollyTeller />, document.getElementById('root'));
