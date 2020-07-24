import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false; 

        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    handleLogoutClick = async () => {
        await this.props.handleLogout();
        this.props.history.push('/');
    }

    componentDidMount() {
        this._isMounted = true; 
        window.addEventListener('logout', this.handleLogoutClick, false);
    }

    componentWillUnmount() {
        this._isMounted = false; 
        window.removeEventListener('logout', this.handleLogoutClick, false);
    }

    render() {
        return (
            <div className="cc"> 
                <div className="navHeader">
                    <h1>
                        {"Welcome " + localStorage.getItem('user') + "!"}
                    </h1>
                </div>
                <div>
                    <nav id="nav">
                        <Link to="/stats" className="nav-item">View stats</Link>
                        <Link to="/changestats" className="nav-item">Change stats</Link>
                        <Link to="/events" className="nav-item">Upcoming events</Link>
                        <Link to="/history" className="nav-item">History</Link>
                        <button onClick={this.handleLogoutClick} className="nav-item">Logout</button>
                    </nav>
                </div>
            </div>
        );
    }
}

export default Nav;