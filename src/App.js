import EventPage from './components/events/EventPage'
import Landing from "./components/landing/Landing"
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom";
import Login from "./components/login/Login"
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import ScrollAnimation from 'react-animate-on-scroll';

class App extends React.Component {
  constructor(props) {
    super(props);
    console.log(localStorage.getItem('login'))
    this.state = {
      logged_in: JSON.parse(localStorage.getItem('login'))
    }
    this.login=this.login.bind(this);
  }

  login(bool) {
    localStorage.setItem( 'login', bool);
    console.log(localStorage.getItem('login'))
    this.setState({logged_in: bool});
  }

  render() {
    return (
      <div>
      <Router>
        <Navbar className="navbar justify-content-end">
        <Link className="navbtn " to="/events"><button className="navbtn">Events</button></Link>
        {(!this.state.logged_in) ? <Link to="/login"><button className="navbtn">Login</button></Link> : <button className="navbtn" onClick={()=>{this.login(false)}}>Logout</button>}
      </Navbar>

        <Switch>
        <Route exact path="/">
        <Landing/>
        </Route>
          <Route exact path="/login">
            <Login logged_in={this.state.logged_in} login={this.login}/>
          </Route>
          <Route path="/events">
            <EventPage logged_in={this.state.logged_in}/>
            
          </Route>
        </Switch>
      </Router>
      <div className="footer">
        <div className="text">Hackathon Global 2021 ©</div>
      </div>
      </div>

    );
  }
}

export default App;
