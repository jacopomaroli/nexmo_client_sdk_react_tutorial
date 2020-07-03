import { combineReducers, createStore } from 'redux'

// actions.js
export const activateMsg = msg => ({
  type: 'ACTIVATE_MSG',
  msg
})

export const closeMsg = () => ({
  type: 'CLOSE_MSG'
})

// reducers.js
export const msg = (state = {}, action) => {
  switch (action.type) {
    case 'ACTIVATE_MSG':
      return action.msg
    case 'CLOSE_MSG':
      return {}
    default:
      return state
  }
}

export const reducers = combineReducers({
  msg
})

// store.js
export function configureStore (initialState = {}) {
  const store = createStore(reducers, initialState)
  return store
}

export const store = configureStore()
