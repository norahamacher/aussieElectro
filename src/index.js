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


class ScrollyTeller extends Component {

   
    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight, panelHeight: window.innerHeight-100 });

      };
    componentDidUpdate(prevState) {
     
        if(prevState.activeId !== this.state.activeId && prevState.activeId!==undefined){
            this.updatePercentages()
        }
    }
    //  m_mapfilter = null;
    state = {
        percentageCalcs: {},
        sections: [],
        width: 0,
        height: 0,
        //the years should be read from a file with their corresponding html content
        // sorteddata: [],
        activeId: 0,
        panelHeight: 800,
        types: [{ "type": "Coal", "active": true },
                { "type": "Solar", "active":true},
                { "type": "Solar2", "active":true},
                { "type": "Hydro", "active":true},
                { "type": "Waste", "active":true},
                { "type": "Storage", "active":true},
                { "type": "Wind", "active":true},
                { "type": "Gas", "active":true}],

        percentages: [{ "type": "Coal", "percentage": 45 },
        { "type": "Gas", "percentage": 10  },
     //   { "type": "Oil", "percentage": 10  },
    //    { "type": "Nuclear", "percentage": 15  },
        { "type": "Hydro", "percentage": 8  },
        { "type": "Wind", "percentage": 6  },
        { "type": "Waste", "percentage": 3  },
        { "type": "Solar", "percentage": 3  }]
    }
    panelChanged = false
   // m_mapFunctions = null
    //"Facility Name", "Status", "Region", "Technology", "Generator Capacity (MW)", "Latitude", "Longitude"


    updatePercentages = () => {
  
        var year = this.state.sections[this.state.activeId].year
       // console.log(year)
        var arr = []
        var yearPerc = this.state.percentageCalcs[year]
     
        //console.log(yearPerc)
        for(var key in yearPerc){
            var obj = {"type" : key, "percentage" : yearPerc[key], "name": key}
            arr.push(obj)
        }
        obj = {}
        for(var i = 0; i < arr.length;i++){
            obj[arr[i].type] = arr[i].percentage
        }
        var t = []
        t.push(obj)
        this.setState({
            percentages: t
        })
        //console.log(t)
    }

   
    
    UNSAFE_componentWillMount = function () {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions()
       
        for (var i = 0; i < sectiondata.sections.length; i++) {
            sectiondata.sections[i].renderparagraphs = this.createPanelContent(sectiondata.sections[i].year, sectiondata.sections[i].paragraphs)
       //     console.log(sectiondata.sections[i].renderparagraphs)
        }
        //  console.log(sectiondata.sections[4].renderparagraphs)
        //read the content from file.
        this.setState({
            sections: sectiondata.sections
        })

      //  console.log(sectiondata.sections)
      
        for(var j = 0; j< dataSolar.features.length;j++){
       
            dataSolar.features[j].properties.capacity/=1000;
           
        }
        //fill percentage calculations
     /*  var helperArray = {}
        var tempArr = {}  
      for(var j =0; j < data2.features.length; j++){
            var obj = data2.features[j]
            var yearstart = obj.properties.yearStart
            var yearend = obj.properties.yearEnd
            if(obj.properties.type === "Solar"){
                obj.properties.capacity/=1000
            }
            for(var k = yearstart; k <=yearend; k++){
                if(tempArr[k]){
                    if(tempArr[k][obj.properties.type]){
                        tempArr[k][obj.properties.type]+=obj.properties.capacity
                    } else {
                        tempArr[k][obj.properties.type]=obj.properties.capacity
                    }
                    helperArray[k]+= obj.properties.capacity
                } else {
                    tempArr[k] = {}
                    tempArr[k][obj.properties.type]=obj.properties.capacity
                    helperArray[k] = obj.properties.capacity
                }
            }
            
        }
       // console.log(helperArray)
        //now normalise to 100%
        for(var key in helperArray){
            for(var key2 in  tempArr[key]){
                var num = tempArr[key][key2]
                num = (num / helperArray[key]) * 100
                tempArr[key][key2] = num
            }
        }
        this.setState({
            percentageCalcs: tempArr
        })*/

        /* this needs to be done once at the beginning and then when the component updates */
        /*var year = sectiondata.sections[0].year
       // console.log(year)
        var arr = []
        var yearPerc = tempArr[year]
     
        //console.log(yearPerc)
        for(var key2 in yearPerc){
            var obj2 = {"type" : key2, "percentage" : yearPerc[key2], "name": key2}
            arr.push(obj2)
        }
        obj = {}
        for( i = 0; i < arr.length;i++){
            obj[arr[i].type] = arr[i].percentage
        }
        var t = []
        t.push(obj)
        this.setState({
            percentages: t
        })*/

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
      }
    allPanels = []
    setActiveID = (id) => {
        this.setState({
            activeId: id
        })
        //this.m_mapFunctions.setFilterYearStart(this.state.years[id])
     //   this.m_mapFunctions.setFilterStartEnd(this.state.sections[id].year)

        this.updatePercentages()
        //in each year i want to display plants that HAVE STARTED but NOT YET ENDED
    }

    createPanelContent(year, paragraphs) {

        //read the text from somewhere based on the given year
        var result = [];
        var filter = "";
        var key =""
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
                        if(action.highlight.type==="type"){
                            filter = {

                                "action":this.setActiveMulti,
                                "objects": []
                            }
                        } else if ( action.highlight.type==="plant"){
                            filter = {

                                "action":this.setActiveName,
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
                    <div  content={paragraphs[i]} id={key} actionFilter={filter}  />
            )
        }
       // console.log(result)
        return result

    }

    //gets called from child components or when the user clicked the type nav menu. updates state of that menu accordingly, also when a scrolltrigger (de)activated a type
    setActiveMulti=(types)=> {
       
        var arr = null
        if(types===null){
             arr =[{ "type": "Coal", "active": true },
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
             for(var i = 0; i < arr.length; i++){
                 for(var j = 0; j < types.length; j++){
                    if(arr[i].type === types[j]){
                        arr[i].active=true
                        break;
                    }
                 }
             }
             
        }
        this.setState({
            types: arr
        })
    }
    
    setActive=(ttype, active) =>{
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
    toggleActive=(ttype)=> {
         console.log(ttype)
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
                    <div className="Panels topDistance" style={{height: this.state.panelHeight}}>

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
                    <MapFunctions types={this.state.types} coalData={dataCoal} currentData={currentData} solarData={dataSolar} height={this.state.panelHeight}  activeYear={this.state.sections !== undefined ?  this.state.sections[this.state.activeId].year : "1950"} />
                   
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
        <div onClick={this.handleClick} className={`navItem navItemColor ${this.props.active ? "navItemActive_"+this.props.type :""}`}> {this.props.type} </div>
        
      );
    }
}

class StackedBar extends Component {
    render () {
        return(
            <div className="leftSide topDistance" style={{height: this.props.height}}  id="stackedBar">
                <Stackedbarchart   percentages={this.props.percentages} width={120} height={this.props.height}> Placeholder for stacked bar</Stackedbarchart>
            </div>
    )}
}
const NavMenuItem = ({ id, name, activeId }) => (

    <ScrollIntoView
        selector={`#section${name}`}
        alignToTop={true} >
        <div className={`navItem ${id === activeId ? "navItemActive" : ""} `}> {name} </div>
    </ScrollIntoView>
)
ReactDOM.render(<ScrollyTeller />, document.getElementById('root'));
