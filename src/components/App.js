import React from 'react'
import { connect } from 'react-redux'

import { showProfilePanel, hideProfilePanel } from '../redux/ui'

import { InviteUserModal } from './InviteUserModal'
import Home from './Home'

const _App = (props) => {
  const profilePanelContainerBlur = (e) => {
    if (!e.relatedTarget) {
      props.hideProfilePanel()
    }
  }

  return (
    <>
      {props.UI.showInviteUserModal &&
        <InviteUserModal />}
      <div id='topbar'>
        <div
          id='profilePanelContainer' onBlur={profilePanelContainerBlur}
        >
          <div id='profilePanelToggler'>
            <button
              onClick={() =>
                props.UI.showProfilePanel
                  ? props.hideProfilePanel()
                  : props.showProfilePanel({ showProfilePanel: true })}
            >
              <span>{props.login.auth0Claims.nickname}</span>
              <img src={props.login.auth0Claims.picture} alt='useravatar' />
            </button>
          </div>
          {props.UI.showProfilePanel &&
            <div id='profilePanel'>
              <button onClick={(e) => { props.logout({ returnTo: window.location.origin }); props.hideProfilePanel() }}>
                <span>Log out</span>
              </button>
            </div>}
        </div>
      </div>
      <Home />
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
