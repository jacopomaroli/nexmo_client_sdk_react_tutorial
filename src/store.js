import { createStore, applyMiddleware, combineReducers } from 'redux'
import chatReducer from './reducer'
import thunk from 'redux-thunk'
import { msg } from './redux'
import { composeWithDevTools } from 'redux-devtools-extension'

export const rootReducer = combineReducers({
  msg,
  chatReducer
})

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export { store }
