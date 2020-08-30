import React, { Component } from 'react';
import Nav from './components/Nav';
import Home from './components/Home';
import Stats from './components/Stats';
import StatsChange from './components/StatsChange';
import Events from './components/Events';
import EventsChangePast from './components/EventsChangePast';
import EventsChangeUpcoming from './components/EventsChangeUpcoming';
import Learn from './components/Learn';
import Lottery from './components/Lottery';
import Snake from './components/Snake';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './index';

/* In case of problems . clear cache (ctrl + f5) or delete and rebuild the app. (delete build folders an run 'npm run build') */
class App extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false; 

    this.state = {
      loginStatus: "NOT_LOGGED_IN",
      user: {}
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin = data => {
    this._isMounted && this.setState({
      loginStatus: "LOGGED_IN",
      user: data
    });
    localStorage.setItem('user', this.state.user);
  }

  handleLogout = () => {
    this._isMounted && this.setState({
      loginStatus: "NOT_LOGGED_IN",
      user: {}
    })
  }

  componentDidMount() {
    this._isMounted = true; 
    window.addEventListener('login', this.handleLogin, false);
    window.addEventListener('logout', this.handleLogout, false);
  }

  componentWillUnmount() {
    this._isMounted = false; 
    window.removeEventListener('login', this.handleLogin, false);
    window.addEventListener('logout', this.handleLogout, false);
  }

  render() {

    return (
      <div>
          <Router>
              <Switch>
                  <Route exact path="/" render={props => (
                    <Home 
                    {... props} 
                    handleLogin={this.handleLogin} 
                    handleLogout={this.handleLogout} 
                    loginStatus={this.state.loginStatus } 
                    
                    /> )} 
                  />
                  <Route exact path="/nav" render={props => ( 
                    <Nav 
                    {... props} 
                    handleLogout={this.handleLogout} 
                    loginStatus={this.state.loginStatus }
                    user={this.state.user}
                    /> )} 
                  />
                  <Route exact path="/stats" render={props => (  <Stats {... props} /> )} />
                  <Route exact path="/changeStats" render={props => (  <StatsChange {... props} /> )} />
                  <Route exact path="/events" render={props => (  <Events {... props} /> )} />
                  <Route exact path="/eventsChangePast" render={props => (  <EventsChangePast {... props} /> )} />
                  <Route exact path="/eventsChangeUpcoming" render={props => (  <EventsChangeUpcoming {... props} /> )} />
                  <Route exact path="/learn" render={props => (  <Learn {... props} /> )} />
                  <Route exact path="/lottery" render={props => (  <Lottery {... props} /> )} />
                  <Route exact path="/snake" render={props => (  <Snake {... props} /> )} />
              </Switch>
          </Router>
      </div>
  );
  }
}

export default App;
