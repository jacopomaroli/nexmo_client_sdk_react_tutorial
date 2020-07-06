import React, { createContext } from 'react'
import NexmoClient from 'nexmo-client'
import { useDispatch } from 'react-redux'
import { updateChatLog } from '../actions'

const LOGIN_NONE = 'LOGIN_NONE'
const LOGIN_PENDING = 'LOGIN_PENDING'
const LOGIN_DONE = 'LOGIN_DONE'

const NexmoClientContext = createContext(null)

const NexmoClientProvider = ({ children }) => {
  let nexmoClient
  let nexmoClientContext
  let loginState = LOGIN_NONE

  const dispatch = useDispatch()

  const login = async (token) => {
    if (loginState !== LOGIN_NONE) return
    loginState = LOGIN_PENDING

    const nexmoApp = await nexmoClient.login(token)

    nexmoApp.on('*', (event, evt) => {
      console.log('event: ', event, evt)
      console.log('nexmoApp.activeStreams.length ', nexmoApp.activeStreams.length)
    })

    loginState = LOGIN_DONE
  }

  const sendText = (conversation, message) => {
    const payload = {
      roomId: conversation.id,
      data: message
    }
    conversation.sendText(message)
    dispatch(updateChatLog(payload))
  }

  if (!nexmoClient) {
    nexmoClient = new NexmoClient({ debug: false })
    nexmoClientContext = {
      nexmoClient,
      login,
      sendText
    }
  }

  return (
    <NexmoClientContext.Provider value={nexmoClientContext}>
      {children}
    </NexmoClientContext.Provider>
  )
}

export { NexmoClientContext, NexmoClientProvider }
