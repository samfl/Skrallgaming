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
        let today = new Date();
        let currentHour = today.getHours();
        let currentLabel = "G'day"
        if((currentHour > 0) && (currentHour <=4)) {
            currentLabel = "Nighty";
        } else if((currentHour > 5) && (currentHour <=9)) {
            currentLabel = "G'morning";
        } else if((currentHour > 10) && (currentHour <=12)) {
            currentLabel = "G'day";
        } else if((currentHour > 13) && (currentHour <=17)) {
            currentLabel = "G'afternoon";
        } else {
            currentLabel = "G'evening";
        } 

        return (
            <div className="cc"> 
                <div className="navHeader">
                    <h1>
                        {currentLabel + " " + localStorage.getItem('user') + "!"}
                    </h1>
                </div>
                <div>
                    <nav id="nav">
                        <Link to="/stats" className="nav-item">Stats</Link>
                        <Link to="/events" className="nav-item">Events</Link>
                        <Link to="/learn" className="nav-item">Learn</Link>
                        <Link to="/lottery" className="nav-item">Lottery</Link>
                        <button onClick={this.handleLogoutClick} className="nav-item">Logout</button>
                    </nav>
                </div>
            </div>
        );
    }
}

export default Nav;