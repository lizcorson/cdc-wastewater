import React from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import _ from 'lodash';
export default class PersonList extends React.Component {
  state = {
    datapoints: [],
    sites: [],
    statesList: [],
    sitesByState: [],
  }

  getWWDByID(id) {
    axios.get(`https://data.cdc.gov/resource/2ew6-ywp6.json?key_plot_id=${id}&$order=date_end ASC`)
    .then(res => {
      const datapoints = res.data;
      this.setState({ datapoints });
    })
  }

  getWWDSites() {
    axios.get(`https://data.cdc.gov/resource/2ew6-ywp6.json?$select=key_plot_id, wwtp_id, wwtp_jurisdiction, county_names&$limit=10000&$order=date_end DESC`)
    .then(res => {
      let sites = res.data;
      sites = [
        ...new Map(sites.map((item) => [item["key_plot_id"], item])).values()];
      sites = _.sortBy(sites, ['wwtp_jurisdiction', 'county_names']);

      let statesList = sites.map((s) => s.wwtp_jurisdiction);
      statesList = Array.from(new Set(statesList));
    
      console.log(statesList);
      this.setState({ sites });
      this.setState({ statesList });
    })
  }

  componentDidMount() {
    this.getWWDSites();
    this.getWWDByID("CDC_md_547_Treatment plant_raw wastewater");
  }

  render() {
      let percentile = this.state.datapoints.map(a => a.percentile);
      let date_end = this.state.datapoints.map(a => a.date_end);
      let ptc_15d =  this.state.datapoints.map(a => a.ptc_15d);
    return (
        <Container>
        <h1>CDC Wastewater Data</h1>

        <Form>
            <Row>
                <Col>
                    <Form.Select aria-label="state">
                        <option>Select your state</option>
                        {this.state.statesList.map(s => <option value={s}>{s}</option>
                        )}
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Select aria-label="site">
                        <option>Select your site</option>
                        {this.state.sitesByState.map(s => <option value={s}>{s}</option>
                        )}
                    </Form.Select>
                </Col>
            </Row>
        </Form>
        
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
        <Plot data={[
            {
                x: date_end,
                y: ptc_15d,
                type: 'scatter',
                mode: 'lines+markers',
                name: '% Change',
            }
        ]} 
            layout={
                    {
                        title: '% Change over the Last 15 Days',
                        xaxis: {title: '14-Day Sample End Date'},
                        yaxis: {title: '% Change'}
                    }
                   }
        />
        <h2>What does this mean?</h2>
        <p>The CDC provides defitions on their <a href="https://covid.cdc.gov/covid-data-tracker/#wastewater-surveillance">wastewater surveillance page</a> in the "About the Data" section. Please note that data between sites is not comparable. Use the historical data to see trends at a single site.</p>
        <h2>Data Source</h2>
        <p>Thanks to the CDC for providing an API to access their <a href="https://data.cdc.gov/Public-Health-Surveillance/NWSS-Public-SARS-CoV-2-Wastewater-Metric-Data/2ew6-ywp6">data</a>!</p>
      </Container>
    )
  }
}