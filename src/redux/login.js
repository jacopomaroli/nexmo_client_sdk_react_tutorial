// actions.js
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
  auth0Token: '',
  nexmoToken: ''
}

export const loginReducer = (state = {}, action) => {
  if (typeof state === 'undefined') {
    return initialState
  }

  switch (action.type) {
    case SET_AUTH0_TOKEN:
      /* return {
        ...state,
        auth0Token: action.auth0Token
      } */
      state.auth0Token = action.auth0Token
      return state
    case SET_NEXMO_TOKEN:
      /* return {
        ...state,
        nexmoToken: action.nexmoToken
      } */
      state.nexmoToken = action.nexmoToken
      return state
    default:
      return state
  }
}
