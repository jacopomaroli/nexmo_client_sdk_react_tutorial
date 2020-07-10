import React from 'react'
import { connect } from 'react-redux'

import { showProfilePanel, hideProfilePanel } from '../redux/ui'

import { InviteUserModal } from './InviteUserModal'
import Home from './Home'

const _App = (props) => {
  return (
    <>
      {props.UI.showInviteUserModal &&
        <InviteUserModal />}
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
              <span>{props.Auth0User.nickname}</span>
              <img src={props.Auth0User.picture} alt='useravatar' />
            </button>
          </div>
          {props.UI.showProfilePanel &&
            <div id='profilePanel'>
              <button onClick={(e) => { e.stopPropagation(); props.logout({ returnTo: window.location.origin }) }}>
                <span>Log out</span>
              </button>
            </div>}
        </div>
      </div>
      <Home Auth0User={props.Auth0User} auth0Token={props.login.auth0Token} nexmoToken={props.login.nexmoToken} />
    </>)
}

const mapStateToProps = state => ({
  UI: state.UI,
  login: state.login
})

const mapDispatchToProps = {
  showProfilePanel,
  hideProfilePanel
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(_App)

export default App
