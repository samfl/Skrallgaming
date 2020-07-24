import React, { Component } from 'react';
import { firestoreDb } from '..';

class StatsChange extends Component {
    constructor() {
        super();

        this.state = {
            nick: "",
            field: "", 
            val: "",
            formStatus: "update",
            loading: false,
            dataChanged: null,
            dataStatus: null,
            selectField: "main"
        }; 

        this.backToMenuClick = this.backToMenuClick.bind(this);
        this.updateField = this.updateField.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleAddPlayer = this.handleAddPlayer.bind(this);
        this.handleDeletePlayer = this.handleDeletePlayer.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    backToMenuClick = () => {
        this.props.history.push("/nav");
    }

    handleDeletePlayer = (e) => {
        this.setState({
            loading: true
        });
        e.preventDefault();

        if(this.state.nickOne === this.state.nickTwo) {
            if(this.state.nickOne && this.state.nickTwo) {
                firestoreDb.collection('players').doc(this.state.nickOne).delete().then( () => 
                    console.log("Document deleted successfully")
                ).catch(err => console.log("Found delete-errors: " + err));

                this.setState({
                    dataStatus: "ok_del",
                    dataChanged: this.state.nickOne
                });
            } else {
                console.log("Missing nick..");
                this.setState({
                    dataStatus: "not_ok_del",
                    dataChanged: null,
                });
            }

        } else {
            console.log("Nick-name 1 and Nick-name 2 are not the same..");
            this.setState({
                dataStatus: "not_ok_del"
            });
        }
        
        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 1000)
        e.target.reset();
    }

    handleAddPlayer = (e) => {
        this.setState({
            loading: true
        });
        e.preventDefault();
        if(this.state.nick) {
            firestoreDb.collection('players').doc(this.state.nick).set({
                nick: this.state.nick,
                main: this.state.main,
                sec: this.state.sec,
                rating: Number(this.state.rating), 
                img: this.state.img
            }).catch(err => console.log("Found set-errors: " + err));
        } else {
            console.log("Enter a nick-name..");
        }

        if(this.state.nick) {
            firestoreDb.collection('players').doc(this.state.nick).get().then(doc => {
                if(doc.exists) {
                    this.setState({ 
                        dataChanged: this.state.nick,
                        dataStatus:  "ok_add"
                    });
                } else {
                    this.setState({ 
                        dataChanged: null,
                        dataStatus: "not_ok_add"
                     });
                     console.log("document does not exist");
                }
            }).catch(err => console.log("Found error in update confirmation check: " + err));
        } else {
            this.setState({
                dataStatus: "not_ok_add"
            });
        }

        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 1000)
        e.target.reset();
    }

    updateField = (e) => {
        this.setState({
            loading: true
        });

        e.preventDefault();
        firestoreDb.collection('players').where('nick', '==', this.state.nick).get().then(snap => {
            if(snap && this.state.nick) {
                snap.forEach(currentDoc => {
                    if(currentDoc) {
                            firestoreDb.collection('players').doc(currentDoc.id).update({
                                [this.state.selectField]: this.state.val
                            }).catch(err => {
                                console.log("Errors in stats update: " + err);
                            })
                    } else {
                        console.log("No documents was found..")
                    }
                    
                })
            } else {
                console.log("Not found..")
            }
        }).catch(err => console.log("Errors in DB connection: " + err));
        
        if(this.state.nick) {
            firestoreDb.collection('players').doc(this.state.nick).get().then(doc => {
                if(doc.exists) {
                    this.setState({ 
                        dataChanged: this.state.nick,
                        dataStatus:  "ok_upd"
                    });
                } else {
                    this.setState({ 
                        dataChanged: null,
                        dataStatus: "not_ok_upd"
                     });
                     console.log("document does not exist");
                }
            }).catch(err => console.log("Found error in update confirmation check: " + err));
        } else {
            this.setState({
                dataStatus: "not_ok_upd"
            });
        }

        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 1000)
        e.target.reset();
    }

    handleChange = (e) => {
        e.preventDefault(); 
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSelectChange = (e) => {
        console.log(this.state.selectField);
        console.log( e.target.value);
        e.preventDefault();
        this.setState({
            selectField: e.target.value
        });
    }

    handleClick = (e) => {
        e.preventDefault();
        this.setState({
            formStatus: e.target.name
        });
    }

    render() {
        let loading = null;
        let activeForm = null;
        let updateResults = null; 

        if(this.state.loading) {
            loading = (<div className="loading"></div>);
        }

        if(this.state.dataStatus === "ok_upd" && !this.state.loading) {
            updateResults = (<div className="updateResultsSuccess">Successfully updated {this.state.dataChanged}</div>);
        } else if(this.state.dataStatus === "not_ok_upd" && !this.state.loading) {
            updateResults = (<div className="updateResultsFail">Update could not be performed</div>);
        } else if(this.state.dataStatus === "ok_add" && !this.state.loading) {
            updateResults = (<div className="updateResultsSuccess">Successfully added {this.state.dataChanged}</div>);
        } else if(this.state.dataStatus === "not_ok_add" && !this.state.loading) {
            updateResults = (<div className="updateResultsFail">Add could not be performed</div>);
        } else if(this.state.dataStatus === "ok_del" && !this.state.loading) {
            updateResults = (<div className="updateResultsSuccess">Successfully deleted {this.state.dataChanged}</div>);
        } else if(this.state.dataStatus === "not_ok_del" && !this.state.loading) {
            updateResults = (<div className="updateResultsFail">Delete could not be performed</div>);
            
        } else {
            updateResults = null;
        }
        
        if(this.state.formStatus === "add") {
            activeForm = (
                <div className="updateFormDiv">
                    <div className="updateFormDivInner">
                        <form id="updateForm" onSubmit={this.handleAddPlayer}> 
                            <div className="updateStatsInputHeader">
                                <h2>Add</h2>
                            </div>
                            <div className="updateStatsInput">
                                <label>Name (nick)</label>
                                <input type="text" name="nick" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="updateStatsInput">
                                <label>Rating (value)</label>
                                <input className="numberInputInStatsChange" type="number" name="rating" onChange={this.handleChange} autoComplete="off" min="1300" max="1600"/>
                            </div>
                            <div className="updateStatsInput">
                                <label>Main (hero)</label>
                                <input type="text" name="main" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="updateStatsInput">
                                <label>Secondary (hero)</label>
                                <input type="text" name="sec" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="updateStatsInput">
                                <label>Profile image (url)</label>
                                <input type="text" name="img" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <input className="updateForm" type="submit" value="Add" />
                        </form>
                    </div>
                </div>
            );
        } else if(this.state.formStatus === "delete") {
            activeForm = (
                <div className="updateFormDiv">
                    <div className="updateFormDivInner">
                        <form id="updateForm" onSubmit={this.handleDeletePlayer}> 
                            <div className="updateStatsInputHeader">
                                <h2>Delete</h2>
                            </div>
                            <div className="updateStatsInput">
                                <label>Name (nick)</label>
                                <input type="text" name="nickOne" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="updateStatsInput">
                                <label>Name (repeat)</label>
                                <input type="text" name="nickTwo" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <input className="updateForm" type="submit" value="Delete" />
                        </form>
                    </div>
                </div>
            );
        } else {
            activeForm = (
                <div className="updateFormDiv">
                    <div className="updateFormDivInner">
                        <form id="updateForm" onSubmit={this.updateField}> 
                            <div className="updateStatsInputHeader">
                                <h2>Update field</h2>
                            </div>
                            <div className="updateStatsInput">
                                <label>Name (nick)</label>
                                <input type="text" name="nick" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="updateStatsInput">
                                <label>Enter field to change</label>
                                <select name="field" value={this.state.selectField} className="selectInChangeStats" onChange={this.handleSelectChange}>
                                    <option value="main">main</option>
                                    <option value="sec">sec</option>
                                    <option value="rating">rating</option>
                                    <option value="img">img</option>
                                    <option value="password">password</option>
                                </select>
                            </div>
                            <div className="updateStatsInput">
                                <label>Enter new value</label>
                                <input type="text" name="val" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <input className="updateForm" type="submit" value="Update" />
                        </form>
                    </div>
                </div>
            );
        }

        return (
            <div className="outerCon">
                <div className="innerCon">
                    <div className="innerHeaderCon">
                        <h1>Change stats</h1>
                        <button onClick={this.backToMenuClick}>Back to menu</button>
                    </div>
                </div>
                <div className="innerCon">
                    <div className="changeStatsBtnWrap">
                        <button name="update" onClick={this.handleClick} className="changeStatsBtn">Update</button>
                        <button name="add" onClick={this.handleClick} className="changeStatsBtn">Add</button>
                        <button name="delete" onClick={this.handleClick} className="changeStatsBtn">Delete</button>
                    </div>
                </div>

                {activeForm}

                <div className="innerCon">
                    {updateResults}
                </div>
                <div className="innerCon">
                        {loading}
                </div>
                <div className="innerCon">
                    <div className="innerContWrapper">
                        <p>For major changes, contact DBA/admin. Major changes can be uploaded through a script following a certain json format.</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default StatsChange;