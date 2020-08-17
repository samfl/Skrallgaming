import React, { Component, useEffect, useState } from 'react';
import { Knob } from "react-rotary-knob";
import * as skins from "react-rotary-knob-skin-pack";
import Wheel from 'lottery-wheel';
import { Redirect } from 'react-router-dom';
import BarChart from 'react-bar-chart';

class Lottery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            status: false
        }

        this.backToMenuClick = this.backToMenuClick.bind(this);
        this.updateName = this.updateName.bind(this);
        this.handleAddPlayer = this.handleAddPlayer.bind(this);
        this.startLottery = this.startLottery.bind(this);
        this.handleSpinResult = this.handleSpinResult.bind(this);
    }

    successHandler = data => {
        if(this.state.players.length) {
            let index = Math.floor(Math.random() * this.state.players.length + 1)
            let tempPlayers = [...this.state.players];
            console.log("index: " + Math.floor(Math.random() * this.state.players.length + 1));
            console.log("data: " + data.text);
            console.log(tempPlayers);
            console.log("tempArr: " + tempPlayers);
            console.log("player: " + tempPlayers[index-1]);
            console.log("player acc: " + tempPlayers[index-1].acc);
            console.log(tempPlayers[index-1].acc);
            tempPlayers[index-1] = {...tempPlayers[index-1], acc: tempPlayers[index-1].acc + (+data.text)}
            this.setState({players: tempPlayers});
        } else {
            alert("Add a player to collect the 'score'");
        }
      };

    backToMenuClick() {
        this.props.history.push('/nav');
    }

    updateName(e) {
        e.preventDefault();
        this.setState({ 
            [e.target.name]: e.target.value
        });
    }

    handleAddPlayer(e) {
        e.preventDefault();
        this.setState(prevState => ({
            players: [...prevState.players, {name: this.state.gambler, acc: 0}]
        }));
        e.target.reset();
    }

    startLottery(e) {
        e.preventDefault();
        console.log(this.state.players);
        this.setState({status: true});
    }

    handleSpinResult(spinData) {
        console.log(spinData);
    }


    componentDidMount() {
       new Wheel( {
            el: document.querySelector("#wheel"),
            radius: 170,
            buttonText: "Spin",
            theme: "light",
            duration: 4500,
            fontSize: 25,
            color: {
                button: "#9120aa",
                buttonFont: "white"
            },
            data: [
              {
                text: '0',
                color: "#ddddd9",
                fontColor: "white",
              },
              {
                text: '1',
                color: "#cececc",
                fontColor: "white",
              },
              {
                text: '2',
                color: "#bfbfbf",
                fontColor: "white",
              },
              {
                text: '3',
                color: "#adadad",
                fontColor: "white",
              },
              {
                text: '4',
                color: "#939393",
                fontColor: "white",
              },
              {
                text: '8',
                color: "#6d6d6d",
                fontColor: "white",
              },
              {
                text: '0',
                color: "#ddddd9",
                fontColor: "white",
              },
              {
                text: '1',
                color: "#cececc",
                fontColor: "white",
              },
              {
                text: '2',
                color: "#bfbfbf",
                fontColor: "white",
              },
              {
                text: '3',
                color: "#adadad",
                fontColor: "white",
              },
              {
                text: '4',
                color: "#939393",
                fontColor: "white",
              },
              {
                text: '16',
                color: "#494949",
                fontColor: "white",
              },
            ],
            onSuccess: this.successHandler,
            onButtonHover(anime, button) {
                anime({
                  targets: button,
                  scale: 1.3,
                  perspective: 80,
                  duration: 400
                });
              },
            handleSpinResult(){

            }
          });
    }

    componentWillUnmount() {

    }

    render() {

    let playersTab = null; 
    let form = null; 
    if(!this.state.status) {
        form = (
            <div>
                <form id="updateForm" onSubmit={this.handleAddPlayer}>
                    <div className="addPlayerToLotteryInput">
                        <label className="addNameLabel">Add gambler</label>
                        <input className="addNameInput" name="gambler" type="text" maxLength="20" value={this.state.password} onChange={this.updateName} autoComplete="off"/>
                    </div>
                    <div className="lotteryBtns">
                        <input className="lotteryBtn" type="submit" value="Add" />
                        <button className="lotteryBtn" onClick={this.startLottery}> Start</button>
                    </div>
                </form>
    
            </div>
        );
    }

    if(this.state.players !== [] ) {
        playersTab = (
            <table className="lotteryTable">
                <thead>
                    <tr>
                        <th>Players:</th>
                        <th>Accumulated:</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.players.map((player, index) => {
                            return (
                                <tr key={index}>
                                    <td>{player.name}</td>
                                    <td>{player.acc}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }
        return (
            <div className="outerCon">
                <div className="innerCon">
                    <div className="innerHeaderCon">
                        <h1>Lottery</h1>
                        <div className="menuButtonWrapper">
                            <button className="mainBtn" onClick={this.backToMenuClick}>Back to menu</button>
                        </div>
                    </div>
                </div>
                <div className="innerCon">
                    <h1 className="lotteryHeader">Wheel of Death</h1>
                </div>        
                <div className="innerCon">
                    <div id="wheel"></div>
                </div>        
                <div className="innerCon">
                    {form}
                </div>
                
                <div className="innerCon">
                    <div className="lotteryWrapper">
                        {playersTab}
                    </div>
                </div>

            </div>
        );
    }
}

export default Lottery;