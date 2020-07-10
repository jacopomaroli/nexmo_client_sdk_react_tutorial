const { promisify } = require('util')
const axios = require('axios')
const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

const client = jwksClient({
  strictSsl: true, // Default value
  jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  requestHeaders: {}, // Optional
  requestAgentOptions: {}, // Optional
  timeout: 30000 // Defaults to 30s
  // proxy: '[protocol]://[username]:[pass]@[address]:[port]', // Optional
})

const verifyJWT = promisify(jwt.verify)

function getKey (header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err, null)
      return
    }
    var signingKey = key.publicKey || key.rsaPublicKey
    callback(null, signingKey)
  })
}

async function getAuth0Token (auth0ClientSecret) {
  console.log(auth0ClientSecret)
  const options = {
    method: 'post',
    url: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`,
    data: {
      grant_type: 'client_credentials',
      client_id: `${process.env.AUTH0_CLIENT_ID_BACKEND}`,
      client_secret: auth0ClientSecret,
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`
    }
  }
  return axios(options)
}

async function getAuth0Users (auth0Token) {
  const options = {
    method: 'GET',
    url: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users`,
    qs: { q: 'nickname:"*"', search_engine: 'v3' },
    headers: { authorization: `Bearer ${auth0Token}` }
  }
  return axios(options)
}

async function main (event, context) {
  const { jwt: token } = JSON.parse(event.body)
  const decoded = await verifyJWT(token, getKey)
  const auth0ClientSecret = Buffer.from(process.env.AUTH0_CLIENT_SECRET_BACKEND_B64, 'base64').toString('utf-8')
  const { data: { access_token: auth0Token } } = await getAuth0Token(auth0ClientSecret)
  const { data: users } = await getAuth0Users(auth0Token)
  return users
}

async function gCatcher (event, context) {
  try {
    const response = await main(event, context)
    console.log('success', response)
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    }
  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }
  }
}

exports.handler = gCatcher
