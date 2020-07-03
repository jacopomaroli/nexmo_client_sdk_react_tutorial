import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import AppContainer from './App'
import * as serviceWorker from './serviceWorker'
import { Auth0Provider } from '@auth0/auth0-react'
import { Provider } from 'react-redux'
import { store } from './redux'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain='jacopo-nexmo.eu.auth0.com'
        clientId='dc2J5H6VwKzJmqOVgh0CDnditfZcrqny'
        redirectUri={window.location.origin}
      >
        <AppContainer />
      </Auth0Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
