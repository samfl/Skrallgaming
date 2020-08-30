import React, { Component } from 'react';
import './Snake.css';
import { firestoreDb } from '..';

export default class Snake extends Component {
  state = {
    loading: false,
    scoreArr: [],
    tickTime: 150,
    rows: 35,
    cols: 35,
    grid: [],
    food: {},
    snake: {
      head: {},
      tail: [],
    },
    currentDirection: 'right',
    die: false,
    score: 0,
    scoreFactor: 10,
  };

  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.backToMenuClick = this.backToMenuClick.bind(this);
    this.handleAddScore = this.handleAddScore.bind(this);
  }

  backToMenuClick() {
    this.props.history.push('/nav');
  }

  handleAddScore() {
    let isValidScore = true;
    let scores = this.state.scoreArr; 
    let scLen = scores.length; 
    let player = localStorage.getItem('user');
    let index = scores.findIndex(obj => obj.nick == player);

    if(scores && player) {
      if((this.state.score < scores[index].score) || !player) {
        isValidScore = false; 
      }
    } else {
      isValidScore = false; 
    }

    if(isValidScore) {
      firestoreDb.collection('snakescore').doc(player).set({
          nick: player,
          score: this.state.score,
          date: new Date()
      }).catch(err => console.log("Found set-errors: " + err));
    } else {
        console.log("Players was not loaded");
    }
  }

  getRandomGrid() {
    return {
      row: Math.floor((Math.random() * this.state.rows)),
      col: Math.floor((Math.random() * this.state.cols))
    }
  }

  // TODO: snake and food begins at the center
  getCenterOfGrid() {
    return {
      row: Math.floor((this.state.rows - 1) / 2),
      col: Math.floor((this.state.cols - 1) / 2),
    }
  }

  resetGrid(state = {}, sendBack = false) {

    if (!Object.keys(state).length) {state = this.state; }

    const grid = [];
    const { rows, cols, food, snake} = state;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isFood = (food.row === row && food.col === col);
        const isHead = (snake.head.row === row && snake.head.col === col);
        let isTail = false;
        snake.tail.forEach(t => {
          if (t.row === row && t.col === col) {
            isTail = true;
          }

          if(t.row === snake.head.row && t.col === snake.head.col) {
            this.handleAddScore();
            clearInterval(window.fnInterval);
          }
        })

        grid.push({
          row,
          col,
          isFood,
          isHead,
          isTail,
        })
      }
    }

    if (sendBack) {
      return grid;
    } else {
      this.setState({
        grid
      })
    }
  }

  gameTick() {
    this.setState((state) => {
      let { currentDirection, snake, food, tickTime} = state;
      let { tail } = snake;
      const { row, col } = state.snake.head;
      let head = { row, col };

      // When game ove is shown, stop the tick
      if (state.die) {
        clearInterval(window.fnInterval);
      }

      // Snake eats
      tail.unshift({
        row: head.row,
        col: head.col,
      })

      // Snake does potty, only when not eating
      if (head.row === state.food.row && head.col === state.food.col) {
        food = this.getRandomGrid();
        tickTime -= 8; 
      } else {
        tail.pop();
      }

      // Snake moves head
      switch (currentDirection) {
        case 'left':
          head.col--;
          break;

        case 'up':
          head.row--;
          break;

        case 'down':
          head.row++;
          break;

        case 'right':
        default:
          head.col++;
          break;
      }

      const newState = {
        ...state,
        tickTime,
        food,
        snake: {
          head,
          tail
        }
      }

      // In new state, check if die conditions are met
      let die = false;
      if (newState.snake.head.row < 0 ||
        newState.snake.head.row >= this.state.rows ||
        newState.snake.head.col < 0 ||
        newState.snake.head.col >= this.state.rows
      ) {
        die = true;
      }

      const grid = this.resetGrid(newState, true);
      const score = newState.snake.tail.length * newState.scoreFactor;

      return {
        ...newState,
        die,
        grid,
        score,
      }
    });

  }

  handleKeyPress(e) {
    let {
      currentDirection
    } = this.state;

    switch (e.keyCode) {
      case 37:
        currentDirection = 'left';
        break;

      case 38:
        currentDirection = 'up';
        break;

      case 39:
      default:
        currentDirection = 'right';
        break;

      case 40:
        currentDirection = 'down';
        break;
    }

    const newState = {
      ...this.state,
      currentDirection,
    }
    const grid = this.resetGrid(newState, true);


    this.setState(state => {
      return {
        ...newState,
        grid
      }
    })
  }

  componentDidMount() {
    this.setState({
        loading: true 
    });
    let tempArr = [];
    firestoreDb.collection('snakescore').orderBy('score', 'desc').get().then(snap => {
        snap.docs.forEach(doc => {
            tempArr.push(doc.data());
        });
        this.setState({
            scoreArr: tempArr,
            loading: false
        });
    });
    
    document.body.addEventListener('keydown', this.handleKeyPress);

    this.setState((state) => {
      const newState = {
        ...state,
        food: this.getRandomGrid(),
        snake: {
          head: this.getCenterOfGrid(),
          tail: state.snake.tail
        }
      };
      const grid = this.resetGrid(newState, true);
      return {
        ...newState,
        grid,
      }
    });

    this.resetGrid();

    // Set tick
    window.fnInterval = setInterval(() => {
      this.gameTick();
    }, this.state.tickTime);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeyPress);
    clearInterval(window.fnInterval);
  }

  render() {
    let gridContent = this.state.grid.map((grid) => {
      return <div
        key={grid.row.toString() + '-' + grid.col.toString()}
        className={
          grid.isHead
          ? 'gridItem is-head' : grid.isTail
          ? 'gridItem is-tail' : grid.isFood
          ? 'gridItem is-food' : 'gridItem'
        }></div>
    });
    if (this.state.die) {
      this.handleAddScore();
      gridContent = <div className="grid-message">
        <h1>Game Over</h1>
      </div>;
    };

  
    let loadingElem = null; 
    if(this.state.loading) {
        loadingElem = (<div className="loading"></div>);
    }

    return (
      <div className="outerCon">
        <div className="innerCon">
            <div className="innerHeaderCon">
                <h1>Snake</h1>

                <div className="menuButtonWrapper">
                    <button className="mainBtn" onClick={this.backToMenuClick}>Back to menu</button>
                </div>
            </div>
        </div>
          <div className="snake-container wrapper">
            <div className="grid-header">
              <h1>{localStorage.getItem('user')}'s score: {this.state.score}</h1>
            </div>
            <div className="grid">{gridContent}</div>
          </div>
          <div className="innerCon">
            <div className="playersOutDiv">
                    <table className="playersTable">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Nick</th>
                                <th>Date</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.scoreArr.map((player, index) => {
                                return (<tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{player.nick}</td>
                                            <td>{player.date.toDate().toLocaleDateString()}</td>
                                            <td>{player.score}</td>
                                        </tr>
                                )
                            })}
                        </tbody>
                    </table>
              </div>
          </div>
          <div className="innerCon">                   
            <div className="loadingCon">
              {loadingElem}
            </div>
          </div>
      </div>

    );
  }
}