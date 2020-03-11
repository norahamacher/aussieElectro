import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import StoryPanel from './StoryPanel.js'
//import * as d3 from 'd3'
import data2 from './ukdata/power_stations.json'
import MapFunctions from './MapFunctions';
import sectiondata from './playdata/sections.json'
import ScrollIntoView from 'react-scroll-into-view'

class ScrollyTeller extends Component {

    //  m_mapfilter = null;
    state = {
        sections:[],
        //the years should be read from a file with their corresponding html content
       // sorteddata: [],
        activeId: 0,
        panelHeight:700
    }
    panelChanged = false
    m_mapFunctions = null
    //"Facility Name", "Status", "Region", "Technology", "Generator Capacity (MW)", "Latitude", "Longitude"

    componentDidMount = function () {
    
        this.m_mapFunctions = new MapFunctions()
        this.m_mapFunctions.init(data2,this.mapContainer)
        this.setState({alldata:data2})


        for(var i = 0; i < sectiondata.sections.length; i++){
            sectiondata.sections[i].renderparagraphs = this.createPanelContent(sectiondata.sections[i].year,sectiondata.sections[i].paragraphs)
        }
        console.log(sectiondata.sections[4].renderparagraphs)
        //read the content from file.
        this.setState({
            sections: sectiondata.sections
        })
        
    }
    allPanels = []
    setActiveID = (id) => {
        this.setState({
            activeId: id
        })
        //this.m_mapFunctions.setFilterYearStart(this.state.years[id])
        this.m_mapFunctions.setFilterStartEnd(this.state.sections[id].year)
       
        //in each year i want to display plants that HAVE STARTED but NOT YET ENDED
    }
 
    createPanelContent(year,paragraphs) {
   
       //read the text from somewhere based on the given year
       var result = [];
       var filter ="";
       for(var i = 0; i < paragraphs.length; i++){
           var key=year+"_"+i
           //check for features like links, if its a link, replace the "text" with a hyperlinnk to the "url"
           if(paragraphs[i].features){
               for(var j = 0; j < paragraphs[i].features.length;j++){
                   var feature = paragraphs[i].features[j]
                   if(feature.type === "link"){
                       paragraphs[i].text = paragraphs[i].text.replace(feature.text,'<a href="'+feature.url+'" target="_blank">'+feature.text+'</a>')
       //                console.log(paragraphs[i].text)
                   }
               }
           }
           //if actions aredefined, they are added to the element here.
           if(paragraphs[i].actions){
               for( j=0; j<paragraphs[i].actions.length;j++){
                var action = paragraphs[i].actions[j]
                if(action.highlight){
                    filter = []
                    //highlight means highlight the words in the text with a class of the same name, and filter things on the map of this name
                    for(var k =0; k<action.highlight.keywords.length; k++){
                        paragraphs[i].text = paragraphs[i].text.replace(action.highlight.keywords[k],"<span class='"+action.highlight.keywords[k]+"'>"+action.highlight.keywords[k]+"</span>")
                        filter.push( this.cap(action.highlight.keywords[k])) //capitalise first letter otherwise the filter breaks 
                    }
                }
               }
           }
        
           result.push(
               <div  key={key}>
                 
                  <PanelContent id={key} content={paragraphs[i].text} actionFilter={filter}/>
                </div>
            )
       }
       return result

    }

    //capitalise the first letter of  string
    cap(lower){
        return lower.replace(/^\w/, c => c.toUpperCase());
    }
    render() {
        return (
            <div className="App">
                <div className="navbar">
                        {this.state.sections.map(
                            (section,i) =>
                            <NavMenuItem
                                key={i}
                                id={i}
                                name={section.year}
                                activeId={this.state.activeId}
                            />
                        )}
                     </div>
                <div className="MainContainer">                  
                    <div className="Panels" /*style={{height: this.state.panelHeight}}*/>        
                        
                        {this.state.sections.map(
                            (section, i) =>
                                //"Facility Name", "Status", "Region", "Technology", "Generator Capacity (MW)", "Latitude", "Longitude"
                                <StoryPanel
                                    key={i}
                                    id={i}
                                    app={this}
                                    activeID={this.state.activeId} //the Storypanels figure out if they are the active panel and display accordingly
                                    title={section.year}
                                    anchorname={"section"+section.year}
                                    content={section.renderparagraphs}
                                />
                        )}
                    </div>
                    <div /*style={{height: this.state.panelHeight}}*/ ref={el => this.mapContainer = el} className="mapContainer" id="map"/>
                </div>
            </div>
        );
    }
}

//"Facility Name", "Status", "Region", "Technology", "Generator Capacity (MW)", "Latitude", "Longitude"
const PanelContent = ({id,content}) => (
     <p id={id}>{content}</p>  
)

const NavMenuItem = ({id,name,activeId}) => (
   

    <ScrollIntoView 
        selector={`#section${name}`} 
        alignToTop={true} > 
        <div className={`navItem ${id===activeId ? "navItemActive" :""}`}> {name} </div>
    </ScrollIntoView>
)
ReactDOM.render(<ScrollyTeller />, document.getElementById('root'));
