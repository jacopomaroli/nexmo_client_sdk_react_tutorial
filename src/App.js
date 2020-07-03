import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import NexmoLoginWrapper from './components/NexmoLoginWrapper'

import './App.css'

function App () {
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

export default App
