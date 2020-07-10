// actions.js
export const SHOW_PROFILE_PANEL = 'SHOW_PROFILE_PANEL'
export const showProfilePanel = () => ({
  type: SHOW_PROFILE_PANEL
})

export const HIDE_PROFILE_PANEL = 'HIDE_PROFILE_PANEL'
export const hideProfilePanel = () => ({
  type: HIDE_PROFILE_PANEL
})

export const SHOW_INVITE_MODAL = 'SHOW_INVITE_MODAL'
export const showInviteModal = () => ({
  type: SHOW_INVITE_MODAL
})

export const HIDE_INVITE_MODAL = 'HIDE_INVITE_MODAL'
export const hideInviteModal = () => ({
  type: HIDE_INVITE_MODAL
})

export const SET_AUTH0_TOKEN = 'SET_AUTH0_TOKEN'
export const setAuth0Token = (auth0Token) => ({
  type: SET_AUTH0_TOKEN,
  auth0Token
})

export const SET_NEXMO_TOKEN = 'SET_NEXMO_TOKEN'
export const setNexmoToken = (nexmoToken) => ({
  type: SET_NEXMO_TOKEN,
  nexmoToken
})

// reducers.js
const initialState = {
  showProfilePanel: false,
  showInviteUserModal: false,
  auth0Token: '',
  nexmoToken: ''
}

export const UI = (state = {}, action) => {
  if (typeof state === 'undefined') {
    return initialState
  }

  switch (action.type) {
    case SHOW_PROFILE_PANEL:
      return {
        ...state,
        showProfilePanel: true
      }
    case HIDE_PROFILE_PANEL:
      return {
        ...state,
        showProfilePanel: false
      }
    case SHOW_INVITE_MODAL:
      return {
        ...state,
        showInviteUserModal: true
      }
    case HIDE_INVITE_MODAL:
      return {
        ...state,
        showInviteUserModal: false
      }
    case SET_AUTH0_TOKEN:
      state.auth0Token = action.auth0Token
      return state
    case SET_NEXMO_TOKEN:
      state.nexmoToken = action.nexmoToken
      return state
    default:
      return state
  }
}
