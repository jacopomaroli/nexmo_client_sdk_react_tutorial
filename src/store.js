import { createStore, applyMiddleware, combineReducers } from 'redux'
import chatReducer from './reducer'
import thunk from 'redux-thunk'
import { UI } from './redux'
import { composeWithDevTools } from 'redux-devtools-extension'

export const rootReducer = combineReducers({
  UI,
  chatReducer
})

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export { store }
