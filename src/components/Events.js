import React, { Component } from 'react';

class Events extends Component {
    constructor(props) {
        super(props);
        this.backToMenuClick = this.backToMenuClick.bind(this);
    }

    backToMenuClick() {
        this.props.history.push("/nav");
    }

    render() {
        return (
            <div className="outerCon">
                <div className="innerCon">
                    <h1>Upcoming Events</h1>
                    <button onClick={this.backToMenuClick}>Back to menu</button>
                </div>
                <div className="innerCon">
                    <p>Content.. (Firestore)</p>
                </div>
            </div>
        );
    }
}

export default Events;