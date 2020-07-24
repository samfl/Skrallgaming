import React, { Component } from 'react';
import '../styles.css';
import { firestoreDb } from '..';

class Stats extends Component {
    constructor() {
        super();
        this.state = {
            playArr: [],
            loading: false
        }
        this.backToMenuClick = this.backToMenuClick.bind(this);
    }

    backToMenuClick() {
        this.props.history.push("/nav");
    }

    componentDidMount() {
        this.setState({
            loading: true 
        });
        let tempArr = [];
        firestoreDb.collection('players').orderBy('rating', 'desc').get().then(snap => {
            snap.docs.forEach(doc => {
                tempArr.push(doc.data());
            });
            this.setState({
                playArr: tempArr,
                loading: false
            });
        });
    }

    getPlayers() {

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
                        <h1>Stats</h1>
                        <button onClick={this.backToMenuClick}>Back to menu</button>
                    </div>
                </div>
                <div className="playersOutDiv">
                    <table className="playersTable">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Nick</th>
                                <th>Rating</th>
                                <th>Main</th>
                                <th>Secondary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.playArr.map((player, index) => {
                                return (<tr key={index}>
                                            <td>{index}</td>
                                            <td>{player.nick}</td>
                                            <td>{player.rating}</td>
                                            <td>{player.main}</td>
                                            <td>{player.sec}</td>
                                        </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="loadingCon">
                    {loadingElem}
                </div>
            </div>
        );
    }
}

export default Stats;