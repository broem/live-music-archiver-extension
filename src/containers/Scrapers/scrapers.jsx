import React from "react";

const ScrapersPage = (props) => {
    // get isActive from props
    const { isActive } = props;
  
      if(isActive) {
      return (
        <div className="container"> 
          <div className="card" style={{width: "18rem"}}>
           <div className="card-header">
            My Event Scrapers
              </div>
              <ul className="list-group list-group-flush">
              </ul>
            </div>
          </div>      
      )
    } else {
      return null;
      }
}

export default ScrapersPage;