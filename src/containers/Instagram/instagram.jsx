import React from "react";
import Back from "../Common/back";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Setup from "./setup";
import Profiles from "./profiles";

const Instagram = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

    return (
  <div>
  <Navbar bg="dark" variant="dark">
      <Container>
      <Navbar.Brand>IG Scraper</Navbar.Brand>
      <Nav className="me-auto">
          <Nav.Link href="#setup" onClick={() => setActiveIndex(0)}>
              Setup
          </Nav.Link>
          <Nav.Link href="#profiles" onClick={() => setActiveIndex(1)}>
              Profiles
          </Nav.Link>
      </Nav>
      <Back />
      </Container>
  </Navbar>
  <Setup
    isActive={activeIndex === 0}
  />
  <Profiles
    isActive={activeIndex === 1}
  />
</div>
    );
  }

export default Instagram;