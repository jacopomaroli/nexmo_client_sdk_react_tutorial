import React from 'react'
import { connect } from 'react-redux'
import { activateMsg, closeMsg } from './redux'

import { useAuth0 } from '@auth0/auth0-react'
import NexmoLoginWrapper from './components/NexmoLoginWrapper'

import './App.css'

const App = (props) => {
  const res = useAuth0()
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    getIdTokenClaims,
    logout
  } = res

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Oops... {error.message} {JSON.stringify(res, null, 2)}</div>
  }

  if (isAuthenticated) {
    return (
      <div className='App'>
        <h1>{props.msg.title || 'Hello World!'}</h1>

        {props.msg.title ? (
          <button onClick={props.closeMsg}>Exit Redux</button>
        ) : (
          <button
            onClick={() =>
              props.activateMsg({ title: 'Hello from redux!' })}
          >
            Click Me!
          </button>
        )}

        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </button>
        Hello {user.name}{' '}
        <NexmoLoginWrapper getIdTokenClaims={getIdTokenClaims} />
      </div>
    )
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>
  }
}

const mapStateToProps = state => ({
  msg: state.msg
})

const mapDispatchToProps = {
  activateMsg,
  closeMsg
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer
