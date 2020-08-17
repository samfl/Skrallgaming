import React, { Component } from 'react';
import {firestoreDb} from '..';

class Events extends Component {
    constructor() {
        super();

        this.state = {
            histEventArr: [],
            upcomEventArr: []
        }
        this.backToMenuClick = this.backToMenuClick.bind(this);
        this.goToChangePast= this.goToChangePast.bind(this);
        this.goToChangeUpcoming= this.goToChangeUpcoming.bind(this);
    }

    backToMenuClick() {
        this.props.history.push("/nav");
    }

    goToChangePast() {
        this.props.history.push("/eventsChangePast");
    }    
    
    goToChangeUpcoming() {
        this.props.history.push("/eventsChangeUpcoming");
    }

    componentDidMount() {
        this.setState({
            loading: true 
        });
        let tempArr = [];
        firestoreDb.collection('events').orderBy('date', 'desc').get().then(snap => {
            snap.docs.forEach(doc => {
                tempArr.push(doc.data());
            });
            this.setState({
                histEventArr: tempArr,
                loading: false
            });
        });


        this.setState({
            loading: true 
        });
        let tempArr2 = [];
        firestoreDb.collection('upcoming').orderBy('date', 'desc').get().then(snap => {
            snap.docs.forEach(doc => {
                tempArr2.push(doc.data());
            });
            this.setState({
                upcomEventArr: tempArr2,
                loading: false
            });
        });
    }

    render() {
        let loadingElem = null; 
        if(this.state.loading) {
            loadingElem = (<div className="loading"></div>);
        }

        return (
            <div className="outerCon">
                <div className="innerCon">
                    <div className="innerHeaderCon">
                        <h1>Events</h1>
                        <div className="menuButtonWrapper">
                            <button className="mainBtn" onClick={this.goToChangePast}>Change past</button>
                            <button className="mainBtn" onClick={this.goToChangeUpcoming}>Change upcoming</button>
                            <button className="mainBtn" onClick={this.backToMenuClick}>Back to menu</button>
                        </div>
                    </div>
                </div>
                <div className="innerCon">
                    <div className="innerhistoryWrapper">
                        <div className="historyContent">
                            <img src="https://i.imgur.com/KnEvuRJ.png" alt="Skrallgaming's logo" /> 
                        </div>
                        <div className="historyContentEven">
                            <h3>About Skrall</h3>
                        </div>
                        <div className="historyContent">
                            <p>Consuming of alcohol n' games</p>
                        </div>
                        <div className="historyContentEven">
                            <h3>Upcoming events</h3>
                        </div>
                        <div className="historyContent">
                            <div className="eventWrapper">
                                    {this.state.upcomEventArr.map((event, index) => {
                                        return (<table key={index} className="historyTable">
                                                    <tbody>
                                                        <tr>
                                                            <th colSpan="2" className="historyHeader">{event.name}</th>
                                                        </tr>
                                                        <tr>
                                                            <th>Date</th> 
                                                            <td>{event.date.toDate().toUTCString()}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Hosts</th> 
                                                            <td>{event.hosts.toString()}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Location</th> 
                                                            <td>{event.location}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Event links</th> 
                                                            <td>{event.links}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Smash info</th> 
                                                            <td>{event.smashInfo.toString()}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Beerpong info</th> 
                                                            <td>{event.beerpongInfo.toString()}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                        )
                                    })}
                                <div className="loadingCon">
                                    {loadingElem}
                                </div>
                            </div>
                        </div>
                        <div className="historyContentEven">
                            <h3>Past events</h3>
                        </div>
                        <div className="historyContent">
                            <div className="eventWrapper">
                                    {this.state.histEventArr.map((event, index) => {
                                        return (<table key={index} className="historyTable">
                                                    <tbody>
                                                        <tr>
                                                            <th colSpan="2" className="historyHeader">{event.name}</th>
                                                        </tr>
                                                        <tr>
                                                            <th>Date</th> 
                                                            <td>{event.date.toDate().toUTCString()}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Hosts</th> 
                                                            <td>{event.hosts.toString()}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Location</th> 
                                                            <td>{event.location}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Participants</th> 
                                                            <td>{event.participants}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Smash winners</th> 
                                                            <td>{event.smashWinner.toString()}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Beerpong winners</th> 
                                                            <td>{event.beerpongWinner.toString()}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                        )
                                    })}
                                <div className="loadingCon">
                                    {loadingElem}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Events;