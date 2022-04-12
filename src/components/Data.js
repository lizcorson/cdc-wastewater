import React from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import Container from 'react-bootstrap/Container';

export default class PersonList extends React.Component {
  state = {
    datapoints: [],
    sites: [],
  }

  getWWDByID(id) {
    axios.get(`https://data.cdc.gov/resource/2ew6-ywp6.json?wwtp_id=${id}&$order=date_end ASC`)
    .then(res => {
      const datapoints = res.data;
      this.setState({ datapoints });
    })
  }

  componentDidMount() {
    this.getWWDByID(576);
  }

  render() {
      let percentile = this.state.datapoints.map(a => a.percentile);
      let date_end = this.state.datapoints.map(a => a.date_end);
      let ptc_15d =  this.state.datapoints.map(a => a.ptc_15d);
    return (
        <Container className="p-3">
        <h1>CDC Wastewater Data</h1>
        
        
        <Plot data={[
            {
                x: date_end,
                y: percentile,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Percentile',
            }
        ]} 
            layout={
                    {
                        title: 'Current Virus Levels',
                        xaxis: {title: '14-Day Sample End Date'},
                        yaxis: {title: 'Percentile'}
                    }
                   }
        />
      </Container>
    )
  }
}