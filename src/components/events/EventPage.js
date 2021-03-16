import React, { Component, useState } from 'react';
import axios from 'axios';
import Fade from 'react-reveal/Fade';
import ScrollAnimation from 'react-animate-on-scroll';

import "./EventPage.css"
import "./SingleEvent.css"

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";

import 'antd/dist/antd.css';

import { message, Menu, Dropdown, Button } from 'antd';
import { UploadOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'


function SpeakerTag(props) {
    return <div>
        <img className="circle" src={props.speaker.profile_pic} />
        <div>{props.speaker.name}</div>
    </div>
}

function SingleEvent(props) {
    let start_time_f = formatDate(props.event.start_time);
    let end_time_f = formatDate(props.event.end_time);

    let event_type = props.event.event_type;

    let link = (props.logged_in) ? props.event.private_url : props.event.public_url;

    let speakers = []
    for (let i = 0; i < props.event.speakers.length; i++) {
        let speaker = props.event.speakers[i];
        speakers.push(<SpeakerTag speaker={speaker} />)
    }

    let related = []
    for (let i = 0; i < props.event.related_events.length; i++) {
        let r_index = props.event.related_events[i];
        related.push(<Event event={props.events[r_index]} />)
    }

    return <div className="s-event-container">
        <Fade top opposite >
            <div className="s-event-box">

                <div className={"event_tag " + event_type}>{event_type}</div>

                <div class="title">{props.event.name}</div>

                <div class="time">{start_time_f} {end_time_f}</div>

                <div class="desc">{props.event.description}</div>
                {speakers}

                <div class="actions">
                    <button> <UploadOutlined className="upload-icon" /></button>
                    <button>Check it out</button>
                </div>
            </div>
            <div>
                <div>Related Events</div>
                {related}</div>
        </Fade>
    </div>

}

function formatDate(date_string) {
    let date = new Date(parseInt(date_string))

    let day_options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    let time_options = { hour: 'numeric', minute: 'numeric', timeZoneName: 'short' }

    let new_date = date.toLocaleString('en-US', day_options)
    let new_time = date.toLocaleString('en-US', time_options)
    return new_date + "• " + new_time;
}

function copy(text) {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    message.success('Link copied');
};

function Event(props) {
    let { path, url } = useRouteMatch();

    let start_time_f = formatDate(props.event.start_time);

    let event_type = props.event.event_type;

    let link = window.location.origin.toString()+path+"/"+props.event.name.replaceAll(" ", "%20");

    return <div>
            <div className="event-block">
                <a href={`${url}/${props.event.name}`}>
                    <Row>
                        <Col col={6}>
                            <div className="time">
                                {start_time_f}
                            </div>
                            <div className="title">
                                {props.event.name}
                            </div>
                        </Col>

                        <Col col={6}>
                            <div className="float-right">
                                <div className={"event_tag " + event_type}>
                                    {event_type}
                                </div>
                                <button className="upload float-right" onClick={(e) => {
                                    e.preventDefault();
                                    copy(link)
                                }}>
                                    <UploadOutlined className="upload-icon"
                                    />
                                </button>
                            </div>
                        </Col>
                    </Row>
                </a>
            </div>
        </div>

}

function formatOption(name) {
    let words = name.split("_");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    name = words.join(" ");
    return name;
}

function getEventTypes(events) {
    let all_event_types = [];
    for (let i = 0; i < events.length; i++) {
        all_event_types.push(events[i].event_type);
    }
    let event_types = [...new Set(all_event_types)]

    let menu = []
    for (let i = 0; i < event_types.length; i++) {
        let name = formatOption(event_types[i]);
        menu.push(<Menu.Item key={event_types[i]}>
            {name}
        </Menu.Item>)
    }
    return menu;
}


function EventContainer(props) {

    const [sortType, setSortType] = useState("start_time");

    let blocks = [];
    for (let i = 0; i < props.events.length; i++) {
        blocks.push(<Event logged_in={props.logged_in} event={props.events[i]}>hi</Event>)
    }

    let menuOptions = getEventTypes(props.all_events);

    let filter_menu = <Menu onClick={props.handleMenuFilter} trigger={['click']}>
        {menuOptions}
    </Menu>

    let sort_menu = <Menu trigger={['click']} onClick={(e) => {
        setSortType(formatOption(e.key))
        props.handleMenuSort(e)
    }}>
        <Menu.Item key="name">Name</Menu.Item>
        <Menu.Item key="start_time" >Start time</Menu.Item>
        <Menu.Item key="end_time">End time</Menu.Item>
    </Menu>

    return <div class="event-container">
        <Row>


            <Col md={3}>
                <Fade bottom cascade>
                    <div>
                        <div className="tagline">Find the Event for you</div>
                        <div className="flex_options">
                            <input className="event-option" value={props.search_term} onChange={props.updateSearch} />
                            <Dropdown className="event-option" overlay={filter_menu} trigger={['click']}>
                                <Button>
                                    Event type <DownOutlined />
                                </Button>
                            </Dropdown>
                            <Dropdown className="event-option" overlay={sort_menu} trigger={['click']}>
                                <Button>
                                    {sortType}<DownOutlined />
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                </Fade>
            </Col>
<Col md={1}>
</Col>

            <Col md={8}>
                <div>
                    {blocks}
                </div>

            </Col>
        </Row>
    </div>

}

function CreatePages(props) {
    let { path, url } = useRouteMatch();

    let routes = []
    let a_events = props.all_events;
    let events = [];

    if (!props.logged_in) {
        for (let i = 0; i < a_events.length; i++) {
            if (a_events[i].permission == "public") {
                events.push(a_events[i])
            }
        }
    } else {
        events = a_events
    }

    events = filterEvents(events, "event_type", props.filter)
    events = sortEvents(events, props.sort[0], props.sort[1])
    events = searchEvents(events, props.search_term)

    console.log(props.search_term);
    for (let i = 0; i < a_events.length; i++) {
        routes.push(<Route exact path={`${path}/${a_events[i].name}`}>
            <SingleEvent events={a_events} logged_in={props.logged_in} event={a_events[i]} />
        </Route>)
    }


    return <Switch>
        <Route exact path={path}>
            <EventContainer search_term={props.search_term} logged_in={props.logged_in}
                updateSearch={props.updateSearch} handleMenuFilter={props.handleMenuFilter}
                handleMenuSort={props.handleMenuSort} events={events} all_events={a_events} />

        </Route>

        {routes}
    </Switch>
}

function sortEvents(events, prop, asc) {
    let new_events = events.sort(function (a, b) {
        if (asc) {

            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);

        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });

    return new_events;

}

function filterEvents(events, prop, value) {
    if (events.length == 0) {
        return [];
    }

    if (value === "") {
        return events;
    }
    let result = events.filter(event => event[prop] == value);
    return result;
}


function searchEvents(events, value) {
    if (events.length == 0) {
        return [];
    }
    if (value === "") {
        return events;
    }

    let result = events.filter(event => event.name.search(value) > -1);
    return result;
}

class EventPage extends React.Component {

    constructor() {
        super();
        this.state = {
            all_events: [],
            filter: "",
            sort: ["start_time", true],
            search_term: "",
        }
        this.componentWillMount = this.componentWillMount.bind(this);
        this.getEvents = this.getEvents.bind(this);
        this.handleMenuSort = this.handleMenuSort.bind(this);
        this.handleMenuFilter = this.handleMenuFilter.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
    }


    handleMenuSort(e) {
        this.setState({ sort: [e.key, true] })
    }

    handleMenuFilter(e) {
        console.log(e.key)
        this.setState({ filter: e.key })
    }

    updateSearch(e) {
        this.setState({ search_term: e.target.value })
    }

    componentWillMount() {
        this.getEvents();

    }

    render() {
        return (
            <div>
                <div>

                </div>
                <CreatePages updateSearch={this.updateSearch} search_term={this.state.search_term}
                    handleMenuFilter={this.handleMenuFilter} handleMenuSort={this.handleMenuSort} filter={this.state.filter}
                    sort={this.state.sort} logged_in={this.props.logged_in} shown_events={this.state.shown_events}
                    all_events={this.state.all_events} />
            </div>

        );
    }

    getEvents() {

        const axios = require('axios');
        const params = {}

        axios.get("https://api.hackthenorth.com/v3/graphql?query={ events { id name event_type permission start_time end_time description speakers { name profile_pic } public_url private_url related_events } }", { params })
            .then(response => {

                //console.log(JSON.stringify(response.data.data.events));
                //console.log("hi");

                let a_events = response.data.data.events;
                for (let i = 0; i < a_events.length; i++) {
                    for (let ii = 0; ii < a_events[i].speakers.length; ii++) {
                        let speaker = a_events[i].speakers[ii]
                        if(speaker.profile_pic == null) {
                            let num = Math.floor((Math.random() * 4) + 1); //random num between 1 and 4
                            speaker.profile_pic = "/images/a"+num+".png"
                        }
                    }
                }
                this.setState({
                    all_events: sortEvents(a_events, "start_time", true),
                });

            }).catch(error => {
                console.log(error);

            })
        {
        }

    }

}

export default EventPage;