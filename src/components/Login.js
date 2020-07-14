import React from 'react'
import { connect } from 'react-redux'
import Async from 'react-async'
import { useAuth0 } from '@auth0/auth0-react'

import { setAuth0Claims, setAuth0Token, setNexmoToken } from '../redux/login'

import App from './App'

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
  const auth0Claims = await getIdTokenClaims()
  const { __raw: auth0Token } = auth0Claims
  const { nexmoJWT: nexmoToken } = await getNexmoJWT(auth0Token)
  props.setAuth0Claims(auth0Claims)
  props.setAuth0Token(auth0Token)
  props.setNexmoToken(nexmoToken)
  return { auth0Token, nexmoToken }
}

const _Login = (props) => {
  const res = useAuth0()
  const {
    isLoading,
    isAuthenticated,
    error,
    // user,
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
      <Async promiseFn={() => getTokens(props, getIdTokenClaims)}>
        {({ data, err, isLoading }) => {
          if (isLoading) return 'Loading...'
          if (err) return `Something went wrong: ${err.message}`
          if (data) return <App logout={logout} />
        }}
      </Async>
    )
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>
  }
}

const mapStateToPropsLogin = state => ({
  login: state.login
})

const mapDispatchToPropsLogin = {
  setAuth0Claims,
  setAuth0Token,
  setNexmoToken
}

const Login = connect(
  mapStateToPropsLogin,
  mapDispatchToPropsLogin
)(_Login)

export default Login
