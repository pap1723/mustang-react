import React, { Component } from 'react';
import './App.css';
import Suggestions from './Suggestions.js'

class Search extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      results: []
    };
  }

  getInfo() {
    const { contacts } = this.props;
    this.setState({ results: contacts })
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 1) {
        if (this.state.query.length % 2 === 0) {
          this.getInfo()
        }
      } else if (!this.state.query) {}
    })
  }

  render() {
    return (
      <form>
        <input placeholder="Search for..." ref={input => this.search = input} onChange={this.handleInputChange} />
        <Suggestions results={this.state.results} />
      </form>
    )
  }

}

export default Search