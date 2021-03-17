
import React, { Component } from 'react';
import "./Landing.css"
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

class Landing extends React.Component {
  constructor(props) {
	super(props);
   }


  render() {
    return (
        <Row className="landing-container">
            <Col lg={9} className="title">Hackathon Global</Col>
            <Col  lg={3} className="title">Hackathon Global</Col>
            </Row>
    
    );
  }
}

export default Landing;