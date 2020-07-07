const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config({ path: '../.env' })

process.env = { ...process.env, ...dotenv.parsed }

const login = require('../functions/login')

const app = express()

app.use(cors())
app.use(bodyParser.json())

// route and their handlers
app.post('/.netlify/functions/login', lambdaProxyWrapper(login.handler))

app.listen(80, () => console.info('Server running on port 80'))

function lambdaProxyWrapper (handler) {
  return (req, res) => {
    // Here we convert the request into a Lambda event
    const event = {
      httpMethod: req.method,
      queryStringParameters: req.query,
      pathParameters: {
        proxy: req.params[0]
      },
      body: JSON.stringify(req.body)
    }

    return handler(event, null, (err, response) => {
      if (err) {
        return res.json({ error: err })
      }

      res.status(response.statusCode)
      res.set(response.headers)

      return res.json(JSON.parse(response.body))
    })
  }
}
