import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, hashHistory} from 'react-router'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import io from 'socket.io-client'
import reducer from './reducer'
import createLogger from 'redux-logger'
import {setClientId, setState, setConnectionState} from './action_creators'
import remoteActionMiddleware from './remote_action_middleware'
import getClientId from './client_id'
import App from './components/App'
import ManagementContainer from './components/Management'
import ClientContainer from './components/Client'

require('./style.css');
const socket = io(`${location.protocol}//${location.hostname}:8090`);
socket.on('state', state =>
  store.dispatch(setState(state))
);
[
  'connect',
  'connect_error',
  'connect_timeout',
  'reconnect',
  'reconnecting',
  'reconnect_error',
  'reconnect_failed'
].forEach(ev =>
  socket.on(ev, () => store.dispatch(setConnectionState(ev, socket.connected)))
);

// Store
const loggerMiddleware = createLogger({
  stateTransformer: (state) => {
    return state.toJS()
  },
  predicate: (getState, action) => action.type !== 'RESORT_ELEMENTS' && action.type !== 'SET_STATE'
})
const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware(socket),
  loggerMiddleware
)(createStore);
const store = createStoreWithMiddleware(reducer);
store.dispatch(setClientId(getClientId()));

const routes = <Route component={App}>
  <Route path="/client" component={ClientContainer}></Route> 
  <Route path="/management" component={ManagementContainer}></Route>
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
