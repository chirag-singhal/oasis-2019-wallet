import React, { Component } from 'react';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';

import './Login.css';

class Login extends Component{
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: ""
        }
    
        this.googleLogin = this.googleLogin.bind(this);
    }

    componentDidMount () {
        this.oauthSetup();
    }
    
    oauthSetup () {
        let that = this;
        window.init = function () {
            let gapi = window.gapi;
            if (gapi) {
                gapi.load('auth2', function () {
                window.auth2 = gapi.auth2.init({
                    ux_mode: 'popup',
                    scope: 'profile email'
                });

                that.setState({ isOauthReady: true, gapi: gapi })
                });
            } else {
                setTimeout(()=>window.init(), 100);
            }
        }
        window.init();
    }

    googleLogin () {
        if (this.state.isOauthReady) {
            this.state.gapi.auth2.getAuthInstance().signIn();

            window.auth2.currentUser.listen((googleUser) => {
                let id_token = googleUser.getAuthResponse().id_token;
                if (id_token) {
                    this.props.onLogin(id_token);
                }
            });
        } else if (!window.isOauthScriptReady) {
            console.log('wait for oauth');
        } else {
            this.oauthSetup();
        }
    }

    login (e) {
        e.preventDefault();
        this.props.onLogin(null, this.state.username, this.state.password);
    }
    

    render() {
        return (
            <div className="Login">
                <img src={require('../../assets/images/logo.png')} className='logo' alt="OASIS-logo" />
                <h1>OASIS'19</h1>
                <h2>Web Wallet</h2>
                <form name="login" id="login-form">
                    <div style={{display: 'flex'}}>
                        <i className="fa fa-user" style={{display: 'flex', alignItems: 'center', fontSize: '1.25rem', color: '#444444'}}></i>
                        <Input 
                            type="text" 
                            name="username" 
                            placeholder="Username" 
                            value={this.state.username} 
                            onChange={e => this.setState({ username: e.target.value })} />
                    </div>
                    <div style={{display: 'flex'}}>
                        <i className="fa fa-lock" style={{display: 'flex', alignItems: 'center', fontSize: '1.25rem', color: '#444444'}}></i>
                        <Input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            value={this.state.password} 
                            onChange={e => this.setState({ password: e.target.value })} />
                    </div>
                    <Button click={(e) => this.login(e)}>LOGIN</Button>
                </form>
                <Button click={this.googleLogin}>BITSian LOGIN</Button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (id_token, username, password) => dispatch({ type: 'LOGIN_USER', id_token, username, password })
    };
};

export default connect(null, mapDispatchToProps)(Login);