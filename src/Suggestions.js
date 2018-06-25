import React from 'react';
import './App.css';

// This is really just external formatting for the Search autocomplete and displays the results under the Search Bar.
const Suggestions = (props) => {
  const options = props.results.map(r => (
    <li key={r.firstName + r.lastName}>
      {r.firstName + ' (' + r.preferredName + ') ' + r.lastName}
    </li>
  ))
  return <ul>{options}</ul>
}

export default Suggestions
