import React from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import _ from 'lodash';
export default class Data extends React.Component {
  state = {
    datapoints: [],
    sites: [],
    statesList: [],
    sitesByState: [],
    currentState: '',
    currentSiteKey: 'default',
    currentCounty: '',
  };

  getWWDByID(id) {
    axios.get(`https://data.cdc.gov/resource/2ew6-ywp6.json?key_plot_id=${id}&$order=date_end ASC`)
      .then(res => {
        const datapoints = res.data;
        this.setState({ datapoints });
      });
  }

  getWWDSites() {
    axios.get('https://data.cdc.gov/resource/2ew6-ywp6.json?$select=key_plot_id, wwtp_id, wwtp_jurisdiction, county_names&$limit=10000&$order=date_end DESC')
      .then(res => {
        let sites = res.data;
        sites = [
          ...new Map(sites.map((item) => [item['key_plot_id'], item])).values()];
        sites = _.sortBy(sites, ['wwtp_jurisdiction', 'county_names', 'wwtp_id']);

        let statesList = sites.map((s) => s.wwtp_jurisdiction);
        statesList = Array.from(new Set(statesList));
    
        this.setState({ sites });
        this.setState({ statesList });
      });
  }

  setWWDSitesByState(stateName) {
    const sitesByState = _.filter(this.state.sites, {'wwtp_jurisdiction': stateName});
    this.setState({ sitesByState });
  }

  componentDidMount() {
    this.getWWDSites();
  }

  countyNameDisplay(countyName, wwtpId) {
    return countyName.replace(/,/g, ', ') + ` (#${wwtpId})`;
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'currentState') {
      this.setWWDSitesByState(e.target.value);
      const currentSiteKey = 'default';
      this.setState({ currentSiteKey });
    } else if (e.target.name === 'currentSiteKey') {
      this.getWWDByID(e.target.value);
      const currentCountyArray = _.filter(this.state.sites, {'key_plot_id': e.target.value});
      const currentCounty = currentCountyArray[0].county_names;
      this.setState({ currentCounty });
    }
  };

  render() {
    let percentile = this.state.datapoints.map(a => a.percentile).map(Number);
    let date_end = this.state.datapoints.map(a => a.date_end);
    let ptc_15d = this.state.datapoints.map(a => a.ptc_15d).map(Number);

    return (
      <Container>
        <Row className="my-5">
          <h1>CDC COVID Wastewater Data</h1>
        </Row>

        <Row className="my-5">
          <Form>
            <Row>
              <Col>
                <Form.Select aria-label="state" name="currentState" onChange={this.handleChange} value={this.state.currentState}>
                  <option value="">Select your state</option>
                  {this.state.statesList.map((s, i) => <option value={s} key={i}>{s}</option>
                  )}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select aria-label="site" name="currentSiteKey" onChange={this.handleChange} value={this.state.currentSiteKey}>
                  <option value="default">Select your county or site</option>
                  {this.state.sitesByState.map((s, i) => <option value={s.key_plot_id} key={i}>{this.countyNameDisplay(s.county_names, s.wwtp_id)}</option>
                  )}
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Row>
        <Row className="my-5">
          {this.state.currentSiteKey !== 'default' && 
        <>
          <h2>Data for {this.state.currentState} - {this.state.currentCounty.replace(/,/g, ', ')}</h2>
          <h6>CDC Site Label: {this.state.currentSiteKey}</h6>
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
        </>}
        </Row>
        <Row className="my-5">
          <h2>What does this mean?</h2>
          <p>The CDC provides defitions on their <a href="https://covid.cdc.gov/covid-data-tracker/#wastewater-surveillance">wastewater surveillance page</a> in the About the Data section. Please note that data between sites is not comparable. Use the historical data to see trends at a single site.</p>
          <h2>Data Source</h2>
          <p>Thanks to the CDC for providing an API to access their <a href="https://data.cdc.gov/Public-Health-Surveillance/NWSS-Public-SARS-CoV-2-Wastewater-Metric-Data/2ew6-ywp6">data</a>!</p>
          <h2>Code</h2>
          <p>This project is <a href="https://github.com/lizcorson/cdc-wastewater">open source</a> and something I threw together in my free time.</p>
        </Row>
      </Container>
    );
  }
}