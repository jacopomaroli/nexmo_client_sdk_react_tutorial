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
      <>
        <div id='topbar'>
          <div id='profilePanelContainer'>
            <div id='profilePanelToggler'>
              <button
                onClick={() =>
                  props.msg.title
                    ? props.closeMsg()
                    : props.activateMsg({ title: 'Hello from redux!' })}
              >
                <span>{user.nickname}</span>
                <img src={user.picture} alt='useravatar' />
              </button>
            </div>
            {props.msg.title &&
              <div id='profilePanel'>
                <button onClick={() => logout({ returnTo: window.location.origin })}>
                  <span>Log out</span>
                </button>
              </div>}
          </div>
        </div>
        <NexmoLoginWrapper getIdTokenClaims={getIdTokenClaims} />
      </>
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
