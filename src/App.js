import EventPage from './components/events/EventPage'
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
      <Router>
        <Link to="/events">Events</Link>
        {(!this.state.logged_in) ? <Link to="/login">Login</Link> : <button onClick={()=>{this.login(false)}}>Logout</button>}

        <Switch>
          <Route exact path="/login">
            <Login login={this.login}/>
          </Route>
          <Route path="/events">
            <EventPage logged_in={this.state.logged_in}/>
            
          </Route>
        </Switch>
      </Router>

    );
  }
}

export default App;
