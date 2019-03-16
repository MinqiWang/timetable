import React, { Component } from 'react';
import './App.css';
import Header from './components/header/Header';
import Display from './components/display/Display';
import SideMenu from './components/side-menu/SideMenu';
import Footer from './components/footer/Footer';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <div className="App-main">
          <div className="App-sidemenu">
            <SideMenu/>
          </div>
          <div className="App-display">
            <Display/>
          </div>
        </div>
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to fuck
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
      </div>
    );
  }
}

export default App;
