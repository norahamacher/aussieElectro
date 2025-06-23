// with help from https://bl.ocks.org/reinson/166bae46dd106b45cf2d77c7802768ca

// zero data converted to 0.001 to avoid messing up the order of the colours if bars are added/removed
import React, { PureComponent } from 'react';
import {
  Bar
} from 'react-chartjs-2';

import stacked100 from "chartjs-plugin-stacked100"

export default class Stackedbarchart extends PureComponent {
  m_colors = {
    "Coal": "#91908d",
    "Solar": "#ffc83e",
    "Hydro": "#43cfef",
    "Wind": "#00a98e",
    "Waste": "#6b4b06",
    "Solar2": "#ea545c",
    "Gas": "#cc9b7a"
  }

  /*
     "Coal", "#ced1cc",
                          "Storage", "#4e80e5",
                          "Solar", "#ffc83e",
                          "Hydro", "#43cfef",
                          "Wind", "#00a98e",
                          "Biomass", "#A7B734",
                          "Solar2", "#ea545c",
                          "Gas", "#cc9b7a",
                          "Waste", "#6b4b06",*/

  state = {
    data: {
      labels: ["%"],
      datasets: [{
        label: 'Employee',
        backgroundColor: "#caf270",
        data: [12, 59, 5, 56, 58, 12, 59, 87, 45],
      }]
    },
    percentages: null
  }
  componentDidUpdate() {

    if (this.props.percentages !== this.state.percentages) {
      var datasets = []
      for (var i = 0; i < this.props.percentages.length; i++) {
        var newObj = {}
        newObj.label = this.props.percentages[i].type
        newObj.backgroundColor = this.m_colors[newObj.label]
        newObj.data = []
        newObj.data[0] = this.props.percentages[i].percentage
        datasets.push(newObj)
      }

      this.setState({
        data: {
          labels: ["capacity"],
          datasets: datasets
        },
        percentages: this.props.percentages
      })
    }
  }

  componentDidMount() {

    var datasets = []
    for (var i = 0; i < this.props.percentages.length; i++) {
      var newObj = {}
      newObj.label = this.props.percentages[i].type
      newObj.backgroundColor = this.m_colors[newObj.label]
      newObj.data = []
      newObj.data[0] = this.props.percentages[i].percentage
      datasets.push(newObj)
    }

    this.setState({
      data: {

        datasets: datasets
      },
      percentages: this.props.percentages
    })
  }
  render() {
    return (


      <Bar
        data={this.state.data}
        width={this.props.width}
        height={this.props.height}
        options={{
          tooltips: {

            displayColors: false,
            callbacks: {
              title: function () { },

              label: function (tooltipItem, data) {
                var label = data.datasets[tooltipItem.datasetIndex].label || '';

                label += ": " + tooltipItem.yLabel;
                return label + "%";
              }
            }
          },
          scales: {
            xAxes: [{
              stacked: true,
              gridLines: {
                display: false,
              }
            }],
            yAxes: [{
              stacked: true,
              gridLines: {
                display: true,
              },

              position: 'right',
              ticks: {
                beginAtZero: true,
                max: 100,
                stepSize: 20
              }

            }]
          },
          layout: {
            padding: {
              left: 20
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false }
        }}
      />

    );
  }
}



