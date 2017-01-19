import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

// Set up our connection & pass it through as a prop to the root component
const server = io('http://localhost:3003/');

ReactDOM.render(<App server={server}/>, document.getElementById('app'));
