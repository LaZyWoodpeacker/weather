import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import './index.css';
import store from './store'
import WeatherList from './view/weatherlist'

ReactDOM.render(
  <Provider store={store}>
    <WeatherList />
  </Provider>,
  document.getElementById('root')
);