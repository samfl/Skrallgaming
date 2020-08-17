import React, { Component } from 'react';
import { firestoreDb } from '..';

class EventsChangeUpcoming extends Component {
    constructor() {
        super();

        this.state = {
            name: "",
            field: "", 
            val: "",
            formStatus: "update",
            loading: false,
            dataChanged: null,
            dataStatus: null,
            selectField: "name"
        }; 

        this.backToMenuClick = this.backToMenuClick.bind(this);
        this.backToHistoryClick = this.backToHistoryClick.bind(this);
        this.updateField = this.updateField.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeString = this.handleChangeString.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleAddEvent = this.handleAddEvent.bind(this);
        this.handleDeleteEvent = this.handleDeleteEvent.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }
q
    backToMenuClick = () => {
        this.props.history.push("/nav");
    }

    backToHistoryClick = () => {
        this.props.history.push("/events");
    }

    handleDeleteEvent = (e) => {
        this.setState({
            loading: true
        });
        e.preventDefault();

        if(this.state.eventOne === this.state.eventTwo) {
            if(this.state.eventOne && this.state.eventTwo) {
                firestoreDb.collection('upcoming').doc(this.state.eventOne).delete().then( () => 
                    console.log("Document deleted successfully")
                ).catch(err => console.log("Found delete-errors: " + err));

                this.setState({
                    dataStatus: "ok_del",
                    dataChanged: this.state.eventOne
                });
            } else {
                console.log("Missing name..");
                this.setState({
                    dataStatus: "not_ok_del",
                    dataChanged: null,
                });
            }

        } else {
            console.log("name-name 1 and name-name 2 are not the same..");
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

    handleAddEvent = (e) => {
        this.setState({
            loading: true
        });
        e.preventDefault();
        if(this.state.name) {
            firestoreDb.collection('upcoming').doc(this.state.name).set({
                name: this.state.name,
                links: this.state.links,
                hosts: this.state.hosts,
                location: this.state.location, 
                beerpongInfo: this.state.beerpongInfo,
                smashInfo: this.state.smashInfo,
                date: new Date()
            }).catch(err => console.log("Found set-errors: " + err));
        } else {
            console.log("Enter a name-name..");
        }

        if(this.state.name) {
            firestoreDb.collection('upcoming').doc(this.state.name).get().then(doc => {
                if(doc.exists) {
                    this.setState({ 
                        dataChanged: this.state.name,
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
        firestoreDb.collection('upcoming').where('name', '==', this.state.name).get().then(snap => {
            if(snap && this.state.name) {
                snap.forEach(currentDoc => {
                    if(currentDoc) {
                            firestoreDb.collection('upcoming').doc(currentDoc.id).update({
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
        
        if(this.state.name) {
            firestoreDb.collection('upcoming').doc(this.state.name).get().then(doc => {
                if(doc.exists) {
                    this.setState({ 
                        dataChanged: this.state.name,
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

    handleChangeString = (e) => {
        e.preventDefault();
        let string = e.target.value; 
        let arr = string.split(",");
        console.log(arr);
        console.log(e.target.name);
        this.setState({
            [e.target.name]: arr
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
                        <form id="updateForm" onSubmit={this.handleAddEvent}> 
                            <div className="updateStatsInputHeader">
                                <h2>Add</h2>
                            </div>
                            <div className="updateStatsInput">
                                <label>Name (upcoming event)</label>
                                <input type="text" name="name" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="updateStatsInput">
                                <label>Links (url)</label>
                                <input className="numberInputInStatsChange" type="text" name="links" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="updateStatsInput">
                                <label>Hosts (names)</label>
                                <input type="text" name="hosts" onChange={this.handleChangeString} autoComplete="off" />
                            </div>
                            <div className="updateStatsInput">
                                <label>Location (adress</label>
                                <input type="text" name="location" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="updateStatsInput">
                                <label>Beerpong info</label>
                                <input type="text" name="beerpongInfo" onChange={this.handleChangeString} autoComplete="off" />
                            </div>
                            <div className="updateStatsInput">
                                <label>Smash info</label>
                                <input type="text" name="smashInfo" onChange={this.handleChangeString} autoComplete="off" />
                            </div>
                            <input className="updateForm" type="submit" value   ="Add" />
                        </form>
                    </div>
                </div>
            );
        } else if(this.state.formStatus === "delete") {
            activeForm = (
                <div className="updateFormDiv">
                    <div className="updateFormDivInner">
                        <form id="updateForm" onSubmit={this.handleDeleteEvent}> 
                            <div className="updateStatsInputHeader">
                                <h2>Delete</h2>
                            </div>
                            <div className="updateStatsInput">
                                <label>Name (upcoming event)</label>
                                <input type="text" name="eventOne" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="updateStatsInput">
                                <label>Name (repeat)</label>
                                <input type="text" name="eventTwo" onChange={this.handleChange} autoComplete="off" />
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
                                <label>Name (upcoming event)</label>
                                <input type="text" name="name" onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="updateStatsInput">
                                <label>Enter field to change</label>
                                <select name="field" value={this.state.selectField} className="selectInChangeStats" onChange={this.handleSelectChange}>
                                    <option value="name">name</option>
                                    <option value="participants">participants</option>
                                    <option value="hosts">hosts</option>
                                    <option value="location">location</option>
                                    <option value="beerpong winners">Beerpong winners</option>
                                    <option value="smash winners">Smash winners</option>
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
                        <h1>Change upcom</h1>
                        <div className="menuButtonWrapper">
                            <button className="mainBtn" onClick={this.backToHistoryClick}>Back to events</button>
                            <button className="mainBtn" onClick={this.backToMenuClick}>Back to menu</button>
                        </div>
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

export default EventsChangeUpcoming;