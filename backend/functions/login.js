const { promisify } = require('util')
const axios = require('axios')
const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

function tokenGenerator (params) {
  const defaultACL = {
    paths: {
      '/**': {}
    }
  }
  const paramACL = params.acl || defaultACL
  var opts = {
    iss: params.iss_name,
    iat: Math.floor(Date.now() / 1000) - 30,
    nbf: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    jti: Date.now(),
    application_id: params.app_id,
    acl: paramACL,
    sub: params.username
  }

  return jwt.sign(opts, {
    key: params.private_key
  }, {
    algorithm: 'RS256'
  })
};

const debugACL = {
  paths: {
    '/v1/users/**': {},
    '/v1/conversations/**': {},
    '/v1/sessions/**': {},
    '/v1/devices/**': {},
    '/v1/image/**': {},
    '/v3/media/**': {},
    '/v1/applications/**': {},
    '/v1/push/**': {},
    '/v1/knocking/**': {},
    '/v1/calls/**': {},
    '/v1/legs/**': {},
    '/v2/users/**': {},
    '/v2/conversations/**': {},
    '/v2/legs/**': {}
  }
}

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

async function maybeCreateUser (username, privateKey) {
  const tokenParams = {
    iss_name: process.env.NEXMO_JTW_ISS_NAME,
    app_id: process.env.NEXMO_APP_ID,
    private_key: privateKey,
    acl: debugACL
  }
  const nexmoJWTAdmin = tokenGenerator(tokenParams)

  const config = {
    headers: { Authorization: `Bearer ${nexmoJWTAdmin}` }
  }
  try {
    const { body: userCreate } = await axios.post('https://api.nexmo.com/beta/users', {
      name: username,
      display_name: username,
      image_url: undefined,
      channels: undefined,
      properties: undefined
    }, config)
    console.log(userCreate)
  } catch (e) {
    console.log(e)
  }
}

async function main (event, context) {
  const { jwt: token } = JSON.parse(event.body)
  const decoded = await verifyJWT(token, getKey)

  const privateKey = Buffer.from(process.env.NEXMO_APP_PRIV_KEY_B64, 'base64').toString('utf-8')

  await maybeCreateUser(decoded.nickname, privateKey)

  const tokenParams = {
    iss_name: process.env.NEXMO_JTW_ISS_NAME,
    app_id: process.env.NEXMO_APP_ID,
    private_key: privateKey,
    username: decoded.nickname,
    acl: debugACL
  }
  const nexmoJWT = tokenGenerator(tokenParams)

  return { nexmoJWT }
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
