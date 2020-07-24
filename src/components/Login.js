import React, { Component } from 'react';
import '../styles.css';
import { isAuthenticated } from '../Auth';

class Login extends Component {

    constructor (props) {
        super(props);

        this._isMounted = false; 

        this.state = {
            username: "",
            password: "",
            status: "Waiting..",
            loading: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleChange = e => {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleLogin = async e => {
        this.setState({
            loading: true,
            status: "Waiting"
        })
        e.preventDefault();
        await isAuthenticated(this.state.username, this.state.password).then(res => {
            if(res){
                console.log("Login success, have fun.");
                this.props.handleSuccessAuth(this.state.username);
                this.setState({
                    status: "Authentication success..",
                    loading: false
                })
            } else {
                console.log("Login failed, try again.");
                this.setState({
                    status: "Authentication failed..",
                    loading: false
                })
            }
        });
    }

    componentDidMount() {
        this._isMounted = true; 
        window.addEventListener('change', this.handleChange, false);
        window.addEventListener('login', this.handleLogin, false);
    }

    componentWillUnmount() {
        this._isMounted = false; 
        window.removeEventListener('change', this.handleChange, false);
        window.removeEventListener('login', this.handleLogin, false);
    }

    render() {
        let loading = null;
        if (this.state.loading) {
            loading = (<div className="loading"></div>);
        }

        let status = this.state.status;
        let statusColor = "grey";
        if(status === "Authentication failed..") {
            statusColor = "red";
        } else if (status === "Authentication success.") {
            statusColor = "green";
        } else {
            statusColor = "grey";
        }

        return (
            <div>
                <form onSubmit={this.handleLogin}>
                    <div className="itemInForm">
                        <label>Username</label>
                        <input name="username" type="text" maxLength="25" value={this.state.username} onChange={this.handleChange} autoComplete="off" />
                    </div>
                    <div className="itemInForm">
                        <label>Password</label>
                        <input name="password" type="password" maxLength="25" value={this.state.password} onChange={this.handleChange} />
                    </div>
                    <input type="submit" value="Login" className="submitInForm" />
                    <div className="itemInForm" id="statusbar">
                        <label className={[statusColor, "loginStatus"].join(' ')}> {status}</label>
                    </div>
                    <div className="loginLoadCon">
                        {loading}
                    </div>
                </form>
            </div>
        );
    };

}

export default Login;