import React, { Component, useState } from 'react';
import axios from 'axios';

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


function SingleEvent(props) {
    return <div>{props.event.name}</div>
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

    let link = (props.logged_in) ? props.event.private_url : props.event.public_url;

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
                            <button className="upload float-right" onClick={(e)=>{
                                e.preventDefault();
                                copy(link)}}>
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

    return <div class="event-container"><Row>
        <Col md={3} className="flex_options">
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

        </Col>

        <Col md={9}>
            {blocks}
        </Col>
    </Row></div>

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
            <SingleEvent event={a_events[i]} />
        </Route>)
    }


    return <Switch>
        <Route exact path={path}>
            <EventContainer search_term={props.search_term} logged_in = {props.logged_in}
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