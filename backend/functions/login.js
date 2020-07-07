const { promisify } = require('util')
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

console.log('JWKS_URI:' + process.env.JWKS_URI)

const client = jwksClient({
  strictSsl: true, // Default value
  jwksUri: process.env.JWKS_URI,
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

async function main (event, context, callback) {
  const { jwt: token } = JSON.parse(event.body)
  const decoded = await verifyJWT(token, getKey)

  const privateKey = Buffer.from(process.env.NEXMO_APP_PRIV_KEY_B64, 'base64').toString('utf-8')

  const tokenParams = {
    iss_name: process.env.NEXMO_JTW_ISS_NAME,
    app_id: process.env.NEXMO_APP_ID,
    private_key: privateKey,
    username: decoded.nickname,
    acl: debugACL
  }
  const nexmoJWT = tokenGenerator(tokenParams)

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ nexmoJWT })
  })
}

async function gCatcher (event, context, callback) {
  try {
    await main(event, context, callback)
  } catch (e) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: e })
    })
  }
}

exports.handler = gCatcher
