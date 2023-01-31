import React from 'react';
import Home from '../../containers/Home/Home';
import Instagram from '../../containers/Instagram/Instagram';
import Scraper from '../../containers/ScrapeBuilder/Scraper';
import Route from '../../containers/Route';
import './popup.css';

const Popup = () => {

  // default route bool
  const defaultRoute = true;
  const instagramRoute = false;


  return (
    <div className="App">
      <Route path="/popup.html">
        {defaultRoute && <Home />}
      </Route>
      <Route path="/instagram">
        <Instagram />
      </Route>
      <Route path="/scrapeBuilder">
        <Scraper></Scraper>
      </Route>
    </div>
  );
};

export default Popup;