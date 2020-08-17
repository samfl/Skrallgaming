import React, { Component } from 'react';

class LearnInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showInfo: false,
            activeInfo: null,
            heroMoves: [],
            heroAttr: [],
            heroMvmts: [],
            loading: false
        }

        this.getMoves = this.getMoves.bind(this);
        this.getAttributes = this.getAttributes.bind(this);
        this.getMovements = this.getMovements.bind(this);
    }
    componentDidMount() {}
    componentWillUnmount() {}

    async getMoves(e) {
        this.state.showInfo ? this.setState({ loading: false}) : this.setState({ loading: true});
        let ENDPOINT = "https://api.kuroganehammer.com/api/characters/" + this.props.apId + "/moves/?game=ultimate";
        let res = await fetch(ENDPOINT)
        .then(res => res.json())
        .then(data => this.setState({
            activeInfo: 'moves',
            heroMoves: data,
            showInfo: !this.state.showInfo
        }))
        .catch(err => console.log("Found fetch err: " + err));
        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 400);
        return res; 
    }

    async getAttributes() {
        this.state.showInfo ? this.setState({ loading: false}) : this.setState({ loading: true});
        let ENDPOINT = "https://api.kuroganehammer.com/api/characters/" + this.props.apId + "/characterattributes?game=ultimate";
        let res = await fetch(ENDPOINT)
        .then(res => res.json())
        .then(data => this.setState({
            activeInfo: 'attributes',
            heroAttr: data,
            showInfo: !this.state.showInfo
        }))
        .catch(err => console.log("Found fetch err: " + err));
        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 400);
        return res; 
    }
    async getMovements() {
        this.state.showInfo ? this.setState({ loading: false}) : this.setState({ loading: true});
        let ENDPOINT = "https://api.kuroganehammer.com/api/characters/" + this.props.apId + "/movements?game=ultimate";
        let res = await fetch(ENDPOINT)
        .then(res => res.json())
        .then(data => this.setState({
            activeInfo: 'movements',
            heroMvmts: data,
            showInfo: !this.state.showInfo
        }))
        .catch(err => console.log("Found fetch err: " + err));
        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 400);
        return res; 
    }

    render() {

        let info = null;
        let loadingElem = null; 
        if(this.state.loading) {
            loadingElem = (<div className="loading"></div>);
        }

        if(this.state.showInfo) {
            if(this.state.activeInfo === 'moves') {
                info = (
                    <table className="learnInfoTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Damage</th>
                                <th>Type</th>
                                <th>Hitbox</th>
                                <th>Angle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.heroMoves.map((move, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{move.Name}</td>
                                            <td>{move.BaseDamage}</td>
                                            <td>{move.MoveType}</td>
                                            <td>{move.HitboxActive}</td>
                                            <td>{move.Angle}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                );
            } else if(this.state.activeInfo === 'attributes') {
                info = (
                    <table className="learnInfoTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Values</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.heroAttr.map((attr, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{attr.Name}</td>
                                            <table className="learnInfoInnerTable">
                                                <tbody>
                                                    <tr>
                                                        {
                                                            attr.Values.map(((el, index) => {
                                                                return <th key={index} className="learnInfoTh">{Object.values(el)[3]}</th>
                                                            }))
                                                        }
                                                    </tr>
                                                    <tr>
                                                        {
                                                            attr.Values.map((el,index) => {
                                                                return <td key={index}>{Object.values(el)[0]}</td>
                                                            })
                                                        }
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                );
            } else if(this.state.activeInfo === 'movements') {
                info = (
                    <table className="learnInfoTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.heroMvmts.map((mvmt, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{mvmt.Name}</td>
                                            <td>{mvmt.Value}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                );
            } else {

            }

        } else {
            info = null; 
        }

        return (
            <div>
                <div className="learnInfo"> 
                    <button className="learnInfoBtn" onClick={this.getMoves}>Moves</button>
                    <button className="learnInfoBtn" onClick={this.getAttributes}>Attributes</button>
                    <button className="learnInfoBtn" onClick={this.getMovements}>Movements</button>
                </div>
                <div>
                    <div className="loadingCon">
                        {loadingElem}
                    </div> 
                    { info }
                </div>
            </div>
            
        );
    }
}

export default LearnInfo;