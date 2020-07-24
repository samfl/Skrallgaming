import React, { Component } from 'react';
import Login from './Login';

class Home extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false; 
        this.handleSuccessAuth = this.handleSuccessAuth.bind(this);
    }

    handleSuccessAuth= async data => {       
        await this.props.handleLogin(data);
        this.props.history.push('/nav');
    }

    componentDidMount() {
        this._isMounted = true; 
        window.addEventListener('auth', this.handleSuccessAuth, false);
    }

    componentWillUnmount() {
        this._isMounted = false; 
        window.removeEventListener('auth', this.handleSuccessAuth, false);
    }

    render() {
        return (
            <div id="home">
                <div id="home-2">
                    <div className="home-header">Welcome Skraller!</div>
                    <Login handleSuccessAuth={this.handleSuccessAuth} />
                </div>
            </div>
        );
    }
}

export default Home;