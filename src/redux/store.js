import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { loginReducer } from './login'
import { UIReducer } from './ui'
import { chatReducer } from './chat/reducer'

export const rootReducer = combineReducers({
  login: loginReducer,
  UI: UIReducer,
  chat: chatReducer
})

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export { store }
