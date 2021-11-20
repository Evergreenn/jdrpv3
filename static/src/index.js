import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import M from "../node_modules/materialize-css/dist/js/materialize";
// import "../node_modules/materialize-css/dist/css/materialize.css";
// M.AutoInit();

ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
