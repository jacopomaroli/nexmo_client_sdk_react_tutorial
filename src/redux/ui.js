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

// reducers.js
const initialState = {
  showProfilePanel: false,
  showInviteUserModal: false
}

export const UIReducer = (state = {}, action) => {
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
    default:
      return state
  }
}
