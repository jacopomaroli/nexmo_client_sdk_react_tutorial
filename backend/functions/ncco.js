const ncco = []

ncco[0] = async function (event, context) {
  const parsedContext = extractNetlifySiteFromContext(context)
  const { to = 'unknown', from = 'unknown', uuid, conversation_uuid } = event.queryStringParameters
  const ncco = [
    /* {
        "action": "talk",
        "text": `Hello There, your number is ${to.split("").join("  ")} and you are calling ${from.split("").join(" ")}`
      }, */
    {
      action: 'talk',
      // "text": `What do you prefer, fish and chips or potatoes? If you prefer fish and chips press 1, of you prefer potatos is 2`,
      text: 'What do you prefer, fish and chips or potatoes?'
      // "bargeIn": true
    },
    /* {
        "action": "input",
        "eventUrl": [`${req.url}/ncco2`]
      }, */
    {
      action: 'input',
      speech: {
        context: [],
        language: 'en-GB',
        uuid: [uuid],
        endOnSilence: 2
      },
      dtmf: {
        submitOnHash: true,
        maxDigits: 4,
        timeOut: 5
      },
      eventUrl: [`${parsedContext.site_url}/.netlify/functions/ncco?id=1`]
    }
  ]
  return ncco
}

ncco[1] = function (event, context) {
  const { dtmf = -1, speech: { results } } = event.body

  const ncco1 = [
    {
      action: 'talk',
      text: 'you have selected fish and chips, you should drink it with beer'
    }
  ]

  const ncco2 = [
    {
      action: 'talk',
      text: 'glad you selected potatos, have a coke with them'
    }
  ]

  const ncco3 = [
    {
      action: 'talk',
      text: 'unrecognized option'
    }
  ]

  let retncco = {}

  let done = false

  for (let i = 0; i < results.length && !done; i++) {
    console.log(results[i])
    switch (results[i].text) {
      case 'fish and chips':
        done = true
        retncco = ncco1
        break
      case 'potatoes':
        done = true
        retncco = ncco2
        break
      default:
        retncco = ncco3
    }
  }

  // console.log(JSON.stringify(retncco, false, 2))

  return retncco
}

const getElem = (obj, path) => path.split('.').reduce((o, i) => (typeof o === 'undefined' || o === null) ? o : o[i], obj)

function extractNetlifySiteFromContext (context) {
  let decoded = {
    site_url: 'http://localhost:9000'
  }
  const data = getElem(context, 'clientContext.custom.netlify')
  if (data) {
    decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
  }
  return decoded
}

async function main (event, context) {
  const { id = 0 } = event.queryStringParameters
  const response = await ncco[id](event, context)
  return response
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
