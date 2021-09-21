import React, { createContext } from 'react'
import NexmoClient from 'nexmo-client'
import { useDispatch } from 'react-redux'
import { updateChatLog } from '../redux/chat/actions'
import { Sphamlet } from '../redux/chat/sphamlet'

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
      /* const payload = {
        data: evt
      } */
      // dispatch(updateChatLog(payload))
    })

    loginState = LOGIN_DONE
  }

  const selectConversation = (conversation) => {
    conversation.on('text', function (sender, textEvent) {
      // console.log(sender)
      // console.log(textEvent)
      if (textEvent.from !== conversation.me.id) {
        // if (rtc.isVisible) { textEvent.seen(); }
        // console.log('got a message from another member:', textEvent, sender)
        const payload = {
          roomId: conversation.id,
          data: {
            message: textEvent.body.text,
            username: sender.user.name
          }
        }
        dispatch(updateChatLog(payload))
      }
    })
  }

  if (!nexmoClient) {
    nexmoClient = new NexmoClient({ debug: false })
    nexmoClient.sphamlet = new Sphamlet()
    // TODO: async mehtod. improve loading consistency
    nexmoClient.sphamlet.loadModel()
    nexmoClientContext = {
      nexmoClient,
      login,
      selectConversation
    }
  }

  return (
    <NexmoClientContext.Provider value={nexmoClientContext}>
      {children}
    </NexmoClientContext.Provider>
  )
}

export { NexmoClientContext, NexmoClientProvider }
