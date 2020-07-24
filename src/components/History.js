import React, { Component } from 'react';

class History extends Component {
    constructor() {
        super();
        this.backToMenuClick = this.backToMenuClick.bind(this);
    }

    backToMenuClick() {
        this.props.history.push("/nav");
    }

    render() {
        return (
            <div className="outerCon">
                <div className="innerCon">
                    <h1>History of Skrällgaming</h1>
                    <button onClick={this.backToMenuClick}>Back to menu</button>
                </div>
                <div className="innerCon">
                </div>
            </div>
        );
    }
}

export default History;