import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Display from './components/Display';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Display/>
        <SideMenu/>
        <Footer/>
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
