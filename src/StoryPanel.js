import React, { Component } from 'react';
import Observer from '@researchgate/react-intersection-observer';


export default class StoryPanel extends Component {
    //a storypanel is visible whenit enters the viewport until another enters.
  state = {
    visible: true ,
    threshold: 1,
    id: this.props.id,
    data: []
  };

    headerHandleChange = event => {
 
        if(event.isIntersecting && this.props.id!==this.props.activeID ) {  //this element scrolled into view
            this.props.app.setActiveID(this.props.id)
        }

    this.setState({
      visible:  this.props.id===this.props.activeID, 
    
    });
  };


  componentDidMount(){
    
         var n = 400
        if(this.divElement.clientHeight  > n) {
            
          //  console.log("Thres: " + n/this.divElement.clientHeight)
            this.setState({
                threshold: [n/this.divElement.clientHeight,1]
            })
        }
       
           
       // https://biocache-ws.ala.org.au/ws/occurrences/search?q={q}&fq={fq}
     
  }

  render(){
    return (  
        <Observer
        onChange={this.headerHandleChange}
        threshold={this.state.threshold}
        >
        <section id={this.props.title} className={`storyPanelSection ${ this.state.visible && this.state.id===this.props.activeID ? 'activePanel':'inactivePanel'}`}
            ref={ (divElement) => { this.divElement = divElement } }   >
          
              <h1 className={`sticky sectiontitle`}>{this.props.title}</h1>
               <div className="panelcontent"> {this.props.content} </div>
           
        </section>
        </Observer>
        )
}
}

