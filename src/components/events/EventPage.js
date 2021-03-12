import React, { Component } from 'react';
import axios from 'axios';


function Event(props) {
    return <div>
        {props.event.name}

    </div>

}
function EventContainer(props) {

    let blocks = [];
    for (let i = 0; i < props.events.length; i++) {
        blocks.push(<Event event={props.events[i]}>hi</Event>)
    }
    return blocks;

}
class EventPage extends React.Component {

    constructor() {
        super();
        this.state = {
            all_events: [],
            logged_in: true,
        }
        this.componentWillMount = this.componentWillMount.bind(this);
        this.getEvents = this.getEvents.bind(this);
    }

    componentWillMount() {
        this.getEvents();

    }

    render() {
        let p_events = [];
        let a_events = this.state.all_events;
        for (let i = 0; i < a_events.length; i++) {
            if (a_events[i].permission == "public") {
                p_events.push(a_events[i])
            }
        }

        return (
            <div>
                <button onClick={() => { this.setState(prevState => ({ logged_in: !prevState.logged_in })) }}>LogIn/Out</button>
                <EventContainer events={(this.state.logged_in) ? a_events : p_events} />
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
                    all_events: a_events,
                });

            }).catch(error => {
                console.log(error);

            })
        {
        }

    }

}

export default EventPage;