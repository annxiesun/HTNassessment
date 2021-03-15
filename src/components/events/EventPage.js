import React, { Component, useState } from 'react';
import axios from 'axios';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";

import 'antd/dist/antd.css';

import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

function SingleEvent(props) {
    return <div>{props.event.name}</div>
}
function Event(props) {
    let { path, url } = useRouteMatch();

    return <div>
        <a href={`${url}/${props.event.name}`}> {props.event.name}</a>

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
        blocks.push(<Event event={props.events[i]}>hi</Event>)
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

    return <div>
        <Dropdown overlay={filter_menu} trigger={['click']}>
            <Button>
                Event type <DownOutlined />
            </Button>
        </Dropdown>
        <Dropdown overlay={sort_menu} trigger={['click']}>
            <Button>
                {sortType}<DownOutlined />
            </Button>
        </Dropdown>
        <input value={props.search_term} onChange={props.updateSearch}/>
        {blocks}</div>

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
            <EventContainer search_term={props.search_term}
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
            sort: ["start_time",true],
            search_term: "",
        }
        this.componentWillMount = this.componentWillMount.bind(this);
        this.getEvents = this.getEvents.bind(this);
        this.handleMenuSort = this.handleMenuSort.bind(this);
        this.handleMenuFilter = this.handleMenuFilter.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
    }


    handleMenuSort(e) {
        this.setState({sort:[e.key, true]})
    }

    handleMenuFilter(e) {
        console.log(e.key)
        this.setState({ filter: e.key })
    }

    updateSearch(e){
        this.setState({search_term:e.target.value})
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