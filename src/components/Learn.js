import React, { Component } from 'react';
import '../styles.css';
import LearnInfo from './LearnInfo'

class Learn extends Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            smashData: [],
            heroMoves: [],
        }

        this.backToMenuClick = this.backToMenuClick.bind(this);
    }

    backToMenuClick() {
        this.props.history.push("/nav");
    }

    componentDidMount() {
        fetch('https://api.kuroganehammer.com/api/characters/?game=Ultimate')
        .then(res => res.json())
        .then(data => this.setState({smashData: data}))
        .catch(err => console.log("Found fetch err: " + err));

        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 1000)
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
                        <h1>Learn</h1>
                        <div className="menuButtonWrapper">
                            <button className="mainBtn" onClick={this.backToMenuClick}>Back to menu</button>
                        </div>
                    </div>
                </div>
                <div className="learnWrapperOuter">
                    <div className="learnWrapper">
                            {
                                this.state.smashData.map((hero, index) => {
                                    return (
                                        <div key={index} className="learnItem" style={{backgroundColor: hero.ColorTheme}}>
                                            <div className="learnHeader">
                                                <div className="learnHeaderText" style={{backgroundColor: hero.ColorTheme}}>{hero.Name}</div>
                                                <img src={hero.ThumbnailUrl} alt="Hero Thumbnail" />
                                                <LearnInfo apId={hero.OwnerId} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                    </div>
                    <div className="loadingCon">
                        {loadingElem}
                    </div> 
                </div>
            </div>
        );
    }
}

export default Learn;