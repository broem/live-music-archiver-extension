import React from 'react';
import Home from '../../containers/Home/Home';
import Instagram from '../../containers/Instagram/Instagram';
import Scraper from '../../containers/ScrapeBuilder/Scraper';
import Route from '../../containers/Route';
import './popup.css';
import { useState } from 'react';
import { useEffect } from 'react';
import Errored from '../../containers/Error/error';

const Popup = () => {

  // default route bool
  const defaultRoute = true;
  const [user, setUser] = useState();

  useEffect(() => {
    // get user from local storage
    chrome.storage.session.get('user', (u) => {
      if (u && u.user) {
        setUser(JSON.parse(u.user));
      }
    });
  }, []);


  return (
    <div className="App">
      <Route path="/popup.html">
        {defaultRoute && <Home />}
      </Route>
      <Route path="/instagram">
        <Instagram />
      </Route>
      <Route path="/scrapeBuilder">
        {user 
        ? <Scraper user={user}></Scraper>
        : <Errored />
        }
      </Route>
    </div>
  );
};

export default Popup;