import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

(function() {
  window.React = React;
  window.ReactDOM = ReactDOM;
  window.App = App;
})();
