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
    type: 'TOGGLE_READY',
  }
}

// Playing stage.
export function startGame() {
  return {
    meta: {
      remote: true
    },
    type: 'START_GAME'
  }
}

export function resortElements(newElements) {
  return {
    meta: {
      remote: true
    },
    type: 'RESORT_ELEMENTS',
    newElements,
  }
}

export function addAnotherElement(code) {
  return {
    meta: {
      remote: true
    },
    type: 'ADD_ANOTHER_ELEMENT',
    code,
  }
}

export function deleteElement(code) {
  return {
    meta: {
      remote: true,
    },
    type: 'DELETE_ELEMENT',
    code,
  }
}

export function signalComplete(timestamp) {
  return {
    meta: {
      remote: true,
    },
    type: 'SIGNAL_COMPLETE',
    timestamp,
  }
}