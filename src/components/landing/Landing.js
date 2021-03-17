
import React, { Component } from 'react';
import "./Landing.css"
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Fade from 'react-reveal/Fade';

class Landing extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <Row className="landing-container">
                <Col lg={9}>
                    <Fade className="title-col" bottom opposite >
                        <div className="title">Hackathon Global</div><div className="desc">the biggest hackathon in the world</div>
                    </Fade>
                </Col>
            </Row>

        );
    }
}

export default Landing;