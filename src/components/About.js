import React from 'react';

export default function About() {
  return (
    <>
      <h3>What does this mean?</h3>
      <p>The CDC provides defitions on their <a href="https://covid.cdc.gov/covid-data-tracker/#wastewater-surveillance">wastewater surveillance page</a> in the About the Data section. Please note that data between sites is not comparable. Use the historical data to see trends at a single site.</p>
      <h3>Why is my state/county missing?</h3>
      <p>Unfortunately, the CDC does not have data for every jurisdiction. This site simply shows what the CDC reports.</p>
      <h3>Why are there multiple sites for a single county? Where are all these sites?</h3>
      <p>This means there are multiple wastewater collection sites for a given county. The CDC does not provide an exact location for sites, only <a href="https://en.wikipedia.org/wiki/FIPS_county_code">FIPS codes</a>, which indicate the state and county.</p>
      <h3>The data for my county seems weird, like a percentile of 999.</h3>
      <p>Some of the data reported by the CDC does seem a bit weird, and it is all labeled as provisional. This site shows what they report, so please contact the <a href="https://data.cdc.gov/Public-Health-Surveillance/NWSS-Public-SARS-CoV-2-Wastewater-Metric-Data/2ew6-ywp6">CDC NWSS program</a> with any questions about the data itself.</p>
      <h3>Data Source</h3>
      <p>Thanks to the CDC for providing an API to access their <a href="https://data.cdc.gov/Public-Health-Surveillance/NWSS-Public-SARS-CoV-2-Wastewater-Metric-Data/2ew6-ywp6">data</a>!</p>
      <h3>Code</h3>
      <p>This project is <a href="https://github.com/lizcorson/cdc-wastewater">open source</a> and something I threw together in my free time. I would love to hear your feedback. <a href="https://twitter.com/Liz_Corson">Tweet at me</a> or open an issue on <a href="https://github.com/lizcorson/cdc-wastewater/issues">GitHub</a>.</p>
    </>
  );

}