// with help from https://bl.ocks.org/reinson/166bae46dd106b45cf2d77c7802768ca

// zero data converted to 0.001 to avoid messing up the order of the colours if bars are added/removed
import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Legend
} from 'recharts';

  
  export default class Stackedbarchart extends PureComponent {
    static jsfiddleUrl = 'https://jsfiddle.net/alidingling/90v76x08/';
   

    render() {
      return (
         <div>
        <BarChart
          width={this.props.width+20}
          height={this.props.height}
          data={this.props.percentages}
          reverseStackOrder={true}
        >
         
          <Bar dataKey="Coal" stackId="a" fill="#ced1cc" />
          
         
          <Bar dataKey="Gas" stackId="a" fill="#cc9b7a" />
          <Bar dataKey="Hydro" stackId="a" fill="#43cfef" />
          <Bar dataKey="Oil" stackId="a" fill="#a45edb" />
          <Bar dataKey="Nuclear" stackId="a" fill="#dd54b6" />
          <Bar dataKey="Wind" stackId="a" fill="#00a98e" />
          <Bar dataKey="Solar" stackId="a" fill="#ffc83e" />
          <Bar dataKey="Biomass" stackId="a" fill="#A7B734" />
            <Legend layout="vertical" align="left" verticalAlign="middle" iconType="rect"/>
        </BarChart>
        
       </div>
      );
    }
  }



