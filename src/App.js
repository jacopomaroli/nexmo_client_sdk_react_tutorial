import React from 'react'
import { connect } from 'react-redux'
import Async from 'react-async'
import { showProfilePanel, hideProfilePanel, setAuth0Token, setNexmoToken } from './redux'

import { useAuth0 } from '@auth0/auth0-react'
import NexmoLoginWrapper from './components/NexmoLoginWrapper'
import { InviteUserModal } from './components/InviteUserModal'
import Home from './components/Home'

import './App.css'

async function getAuth0TokenAsync (getIdTokenClaims) {
  const claims = await getIdTokenClaims()
  const auth0Token = claims.__raw
  return auth0Token
}

async function getNexmoJWT (auth0Token) {
  const res = await fetch('/.netlify/functions/login', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ jwt: auth0Token })
  })
  if (!res.ok) { throw res }
  return res.json()
}

async function getTokens (props, getIdTokenClaims) {
  const auth0Token = await getAuth0TokenAsync(getIdTokenClaims)
  const { nexmoJWT: nexmoToken } = await getNexmoJWT(auth0Token)
  props.setAuth0Token({ auth0Token })
  props.setNexmoToken({ nexmoToken })
  return { auth0Token, nexmoToken }
}

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
        {props.UI.showInviteUserModal &&
          <InviteUserModal />}
        <Async promiseFn={() => getTokens(props, getIdTokenClaims)}>
          {({ data, err, isLoading }) => {
            if (isLoading) return 'Loading...'
            if (err) return `Something went wrong: ${err.message}`
            if (data) {
              const { nexmoToken, auth0Token } = data
              return (
                <>
                  <div id='topbar'>
                    <div
                      id='profilePanelContainer' onBlur={() => props.UI.showProfilePanel && /* props.hideProfilePanel() */ false}
                    >
                      <div id='profilePanelToggler'>
                        <button
                          onClick={() =>
                            props.UI.showProfilePanel
                              ? props.hideProfilePanel()
                              : props.showProfilePanel({ showProfilePanel: true })}
                        >
                          <span>{user.nickname}</span>
                          <img src={user.picture} alt='useravatar' />
                        </button>
                      </div>
                      {props.UI.showProfilePanel &&
                        <div id='profilePanel'>
                          <button onClick={(e) => { e.stopPropagation(); logout({ returnTo: window.location.origin }) }}>
                            <span>Log out</span>
                          </button>
                        </div>}
                    </div>
                  </div>
                  <NexmoLoginWrapper Auth0User={user} auth0Token={auth0Token} nexmoToken={nexmoToken} />
                </>)
            }
          }}
        </Async>
      </>
    )
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>
  }
}

const mapStateToProps = state => ({
  UI: state.UI
})

const mapDispatchToProps = {
  showProfilePanel,
  hideProfilePanel,
  setAuth0Token,
  setNexmoToken
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer
