import React, { Component } from 'react';
import "./Login.css"
import Fade from 'react-reveal/Fade';

const correct_user = "123"
const correct_pass = "456"
class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: "",
        password: ""
      }
      this.checkLogin = this.checkLogin.bind(this);
      this.changeUser = this.changeUser.bind(this);
      this.changePass = this.changePass.bind(this);
    }
  
    checkLogin() {
        if (this.state.username == correct_user &&
            this.state.password == correct_pass
        ) {
            this.props.login(true);
        }
    }

    changeUser(e){
        this.setState({username: e.target.value})
    }
    changePass(e){
        this.setState({password: e.target.value})
    }
    render() {
      return (
          <div className="login-c">
        <Fade bottom opposite >
        <div className="login-block">
            <div class="title">Login</div>
            <div class="label">Username</div>
            <input onChange={this.changeUser} value={this.state.username}/>
            <div class="label">Password</div>
            <input onChange={this.changePass} value={this.state.password}/>
            <button onClick={this.checkLogin}>Login</button>
            </div>
  </Fade>
  </div>
      );
    }
  }
  
  export default Login;