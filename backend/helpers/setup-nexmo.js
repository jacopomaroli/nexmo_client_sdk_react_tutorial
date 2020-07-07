const axios = require('axios')
const dotenvLocal = require('dotenv').config({ path: '.env' })
const dotenvProject = require('dotenv').config({ path: '../.env' })

console.log(dotenvLocal.parsed)

process.env = { ...process.env, ...dotenvLocal.parsed, ...dotenvProject.parsed }

const config = {
  siteUrl: process.env.SITE_URL,
  applicationId: process.env.NEXMO_APP_ID,
  applicationName: process.env.NEXMO_APPLICATION_NAME,
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
}

async function applicationSetup ({ config }) {
  const { siteUrl, applicationId, applicationName, nexmoAccount, apiKey, apiSecret } = config
  const devAPIToken = Buffer.from(`${apiKey}:${apiSecret}`, 'utf-8').toString('base64')

  const { data, status } = await axios({
    method: 'PUT',
    url: `https://api.nexmo.com/v2/applications/${applicationId}`,
    data: {
      name: applicationName,
      capabilities: {
        voice: {
          webhooks: {
            answer_url: {
              address: `${siteUrl}/ncco`,
              http_method: 'GET'
            },
            event_url: {
              address: `${siteUrl}/voiceEvent`,
              http_method: 'POST'
            }
          }
        }
      }
    },
    headers: { Authorization: `basic ${devAPIToken}` }
  })
  console.log(data)
  console.log(status)
}

applicationSetup({ config })
