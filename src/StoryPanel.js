import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Observer from '@researchgate/react-intersection-observer';
import ReactHtmlParser from 'react-html-parser';
import MapFunctions from './MapFunctions'
export default class StoryPanel extends Component {
  //a storypanel is visible whenit enters the viewport until another enters.
  state = {
    visible: true,
    id: this.props.id,
    anchorname: this.props.anchorname,
    paragraphs: []
  };
  handleWaypointActivated(id){
    console.log("hi " + id)
}
  headerHandleChange = event => {

    if (event.isIntersecting && this.props.id !== this.props.activeID) {  //this element scrolled into view
      this.props.app.setActiveID(this.props.id)
    }

    this.setState({
      visible: this.props.id === this.props.activeID

    });
  };

  componentDidMount(){
    var res = [];
    for(var i = 0; i < this.props.content.length; i++){
      res.push(
        {"text" : this.props.content[i].props.children.props.content, "filter":  this.props.content[i].props.children.props.actionFilter}
      )
 
    
    this.setState({
      paragraphs: res
    })
  }
}
  render() {

    return (
      <section id={"section_"+this.state.id} className={`storyPanelSection ${this.state.visible && this.state.id === this.props.activeID ? 'activePanel' : 'inactivePanel'}`} >
        <Observer onChange={this.headerHandleChange}
          threshold={1}
        >

          <h1 id={this.props.anchorname} className={`sticky sectiontitle`}>{this.props.title}</h1>
        </Observer>

        <div id={this.props.anchorname + "_id"} className="panelcontent"> 
          {this.state.paragraphs.map(
              (paragraph, i) =>
              <StoryParagraph
                key={this.state.anchorname+"_id_p" +i} 
                id={this.state.anchorname+"_id_p" +i} 
                paragraph={paragraph.text}
                actionFilter={paragraph.filter}
                
                />
          )}
        </div>

      </section>

    )
  }
}


class StoryParagraph extends Component {

  visible=false
  highlighted= false

  m_mapFunctions=null
  m_filterArray =["any",[]]
  state= {
    id: this.props.id,
    topOffset: 0
  }

  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }
  
 
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  };
  
  handleScroll(event) {
    if(this.state.visible){
      
        var topOffset = ReactDOM.findDOMNode(this).getBoundingClientRect().top
        var bottomOffset = ReactDOM.findDOMNode(this).getBoundingClientRect().bottom
        
        if((topOffset > 150 && topOffset < 300) || (topOffset < 150 && topOffset > 0 && bottomOffset > 300)){
          //if this paragraph has anactionFilter to it, apply it!
          if(this.props.actionFilter){
            if(this.m_mapFunctions===null)
            this.m_mapFunctions = new MapFunctions()
         
            this.m_mapFunctions.setFilterTypeString(this.m_filterArray)
            
          }

          this.setState({
           highlighted:true
          })
          
         } else {
           //visible should update...
           this.setState({
            highlighted:false
           })
           //deactivate filter if thereisonw
           if(this.props.actionFilter){
            if(this.m_mapFunctions===null)
            this.m_mapFunctions = new MapFunctions()
         
            this.m_mapFunctions.showAllTypes()
            
          }
         }
    }
  }

  componentDidMount(){
    window.addEventListener('scroll', this.handleScroll);

    //construct the filter if there is one
    if(this.props.actionFilter){
      console.log("I got an actionFilter " + this.props.actionFilter)
      this.m_filterArray=["any"]
       for(var i =0;i < this.props.actionFilter.length; i++){
        // [ "any",["==", ["get", "type"], "Coal"], ["==", ["get", "type"], "Gas"], ["==", ["get", "type"], "Oil"], ["==", ["get", "type"], "Nuclear"]];
        //['!=', ['string', ['get', 'technology']], 'Battery (Discharging)'];
        this.m_filterArray.push(["==",["get","type"],this.props.actionFilter[i]])
      }
    }
  }

  paragraphChange = event => {
    this.setState({
      visible: event.isIntersecting
    })
   
  }

  render(){
    return(
      <Observer 
      onChange={this.paragraphChange}
      threshold={1}
   
      >
      <p 
      className={`scrolltext ${this.state.highlighted ? "active" :""}` }  
      id={this.props.id}>
        {ReactHtmlParser(this.props.paragraph)}  
       { this.props.actionFilter}
      </p>
      </Observer>
    )
  }
}