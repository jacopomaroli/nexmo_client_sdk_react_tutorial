import React from 'react'
import Async from 'react-async'
import Home from './Home'

class NexmoLoginWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.getNexmoJWT = this.getNexmoJWT.bind(this)
  }

  async getNexmoJWT () {
    const claims = await this.props.getIdTokenClaims()
    const auth0Token = claims.__raw
    const res = await fetch('http://localhost:80/.netlify/functions/login', {
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

  render () {
    return (
      <Async promiseFn={this.getNexmoJWT}>
        {({ data, err, isLoading }) => {
          if (isLoading) return 'Loading...'
          if (err) return `Something went wrong: ${err.message}`
          if (data) return <Home token={data.nexmoJWT} />
        }}
      </Async>
    )
  }
}

export default NexmoLoginWrapper
