import {
  List,
  Map
}  from 'immutable';

function setConnectionState(state, connectionState, connected) {
  return state.set('connection', Map({
    state: connectionState,
    connected
  }));
}

function setState(state, newState) {
  return state.merge(newState);
}

export default function(state = Map(), action) {
  switch (action.type) {
    case 'SET_CLIENT_ID':
      return state.set('clientId', action.clientId);
    case 'SET_CONNECTION_STATE':
      return setConnectionState(state, action.state, action.connected);
    case 'SET_STATE':
      return setState(state, action.state);
    case 'RESORT_ELEMENTS':
      return state.setIn(['player', state.get('clientId'), 'elements'], action.newElements)
    default:
      return state
  }
}