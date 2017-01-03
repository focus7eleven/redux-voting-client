export function setClientId(clientId) {
  return {
    type: 'SET_CLIENT_ID',
    clientId
  };
}

export function setConnectionState(state, connected) {
  return {
    type: 'SET_CONNECTION_STATE',
    state,
    connected
  };
}

export function setState(state) {
  return {
    type: 'SET_STATE',
    state
  };
}

// Prepare stage.
export function joinGame() {
  return {
    meta: {
      remote: true
    },
    type: 'JOIN_GAME',
  }
}

export function toggleReady() {
  return {
    meta: {
      remote: true
    },
    type: 'TOGGLE_READY'
  }
}

export function startGame() {
  return {
    type: 'START_GAME'
  }
}

export function vote(entry) {
  return {
    meta: {
      remote: true
    },
    type: 'VOTE',
    entry
  };
}

export function next() {
  return {
    meta: {
      remote: true
    },
    type: 'NEXT'
  };
}

export function restart() {
  return {
    meta: {
      remote: true
    },
    type: 'RESTART'
  };
}