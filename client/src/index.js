import 'babel-polyfill';

import React from 'react'; 
import { render } from 'react-dom'; 
import App from './Components/app';
import allReducers from './reducers';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

const store = createStore(allReducers);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);