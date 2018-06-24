import React, { Component } from 'react';
import './App.css';

const Suggestions = (props) => {
  const options = props.results.map(r => (
    <li key={r.firstName + r.lastName}>
      {r.firstName + ' (' + r.preferredName + ') ' + r.lastName}
    </li>
  ))
  return <ul>{options}</ul>
}

export default Suggestions
