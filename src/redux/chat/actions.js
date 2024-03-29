// These are our action types
export const CREATE_ROOM_REQUEST = 'CREATE_ROOM_REQUEST'
export const CREATE_ROOM_SUCCESS = 'CREATE_ROOM_SUCCESS'
export const CREATE_ROOM_ERROR = 'CREATE_ROOM_ERROR'

// Now we define actions
export function createRoomRequest () {
  return {
    type: CREATE_ROOM_REQUEST
  }
}

export function createRoomSuccess (payload) {
  return {
    type: CREATE_ROOM_SUCCESS,
    payload
  }
}

export function createRoomError (error) {
  return {
    type: CREATE_ROOM_ERROR,
    error
  }
}

export function createRoom (nexmoClient, roomName) {
  return async function (dispatch) {
    dispatch(createRoomRequest())
    try {
      const conversationData = { name: roomName }
      const conversation = await nexmoClient.application.newConversation(conversationData)
      console.log(conversation)
      const member = await conversation.join()
      console.log(member)
      dispatch(createRoomSuccess(member))
    } catch (error) {
      dispatch(createRoomError(error))
    }
  }
}

export const JOIN_ROOM_REQUEST = 'JOIN_ROOM_REQUEST'
export const JOIN_ROOM_SUCCESS = 'JOIN_ROOM_SUCCESS'
export const JOIN_ROOM_ERROR = 'JOIN_ROOM_ERROR'

export function joinRoomRequest () {
  return {
    type: JOIN_ROOM_REQUEST
  }
}

export function joinRoomSuccess (payload) {
  return {
    type: JOIN_ROOM_SUCCESS,
    payload
  }
}

export function joinRoomError (error) {
  return {
    type: JOIN_ROOM_ERROR,
    error
  }
}

export function joinRoom (nexmoClientContext, roomId) {
  const nexmoClient = nexmoClientContext.nexmoClient
  return async function (dispatch) {
    dispatch(joinRoomRequest())
    try {
      await nexmoClient.application.getConversations()
      const conversation = Array.from(nexmoClient.application.conversations.values()).find(e => e.name === roomId)
      let member = conversation.me
      if (conversation.me.state === 'INVITED') {
        member = await conversation.join()
      }
      const events = await conversation.getEvents()
      // console.log(events)
      const eventsA = Array.from(events.items.keys()).map(e => events.items.get(e))
      const textEvents = eventsA.filter(e => e.type === 'text')
      const normalizedTextEvents = textEvents.map(e => {
        const member = e.conversation.members.get(e.from)
        const username = member ? member.user.name : 'unknown'
        return {
          message: e.body.text,
          username
        }
      })
      for (let i = 0; i < normalizedTextEvents.length; i++) {
        normalizedTextEvents[i].isSpam = await nexmoClientContext.nexmoClient.sphamlet.predict(normalizedTextEvents[i].message)
      }
      // console.log(normalizedTextEvents)
      nexmoClientContext.selectConversation(conversation)
      const payload = {
        room: {
          name: conversation.name,
          id: conversation.id
        },
        username: member.user.name,
        chatLogCursor: {
          next: events.cursor.next
        },
        chatLog: normalizedTextEvents
      }
      dispatch(joinRoomSuccess(payload))
    } catch (error) {
      dispatch(joinRoomError(error))
    }
  }
}

export const LOAD_OLDER_REQUEST = 'LOAD_OLDER_REQUEST'
export const LOAD_OLDER_SUCCESS = 'LOAD_OLDER_SUCCESS'
export const LOAD_OLDER_ERROR = 'LOAD_OLDER_ERROR'

export function loadOlderRequest () {
  return {
    type: LOAD_OLDER_REQUEST
  }
}

export function loadOlderSuccess (payload) {
  return {
    type: LOAD_OLDER_SUCCESS,
    payload
  }
}

export function loadOlderError (error) {
  return {
    type: LOAD_OLDER_ERROR,
    error
  }
}

export function loadOlder (nexmoClientContext, roomId, cursorNext) {
  const nexmoClient = nexmoClientContext.nexmoClient
  return async function (dispatch) {
    dispatch(loadOlderRequest())
    try {
      await nexmoClient.application.getConversations()
      const conversation = Array.from(nexmoClient.application.conversations.values()).find(e => e.name === roomId)
      const getEventsParams = {
        cursor: cursorNext
      }
      const events = await conversation.getEvents(getEventsParams)
      // console.log(events)
      const eventsA = Array.from(events.items.keys()).map(e => events.items.get(e))
      const textEvents = eventsA.filter(e => e.type === 'text')
      const normalizedTextEvents = textEvents.map(e => {
        const member = e.conversation.members.get(e.from)
        const username = member ? member.user.name : 'unknown'
        return {
          username,
          message: e.body.text
        }
      })
      for (let i = 0; i < normalizedTextEvents.length; i++) {
        normalizedTextEvents[i].isSpam = await nexmoClientContext.nexmoClient.sphamlet.predict(normalizedTextEvents[i].message)
      }
      // console.log(normalizedTextEvents)
      const payload = {
        chatLogCursor: {
          next: events.cursor.next
        },
        chatLog: normalizedTextEvents
      }
      dispatch(loadOlderSuccess(payload))
    } catch (error) {
      dispatch(loadOlderError(error))
    }
  }
}

export const SEND_TEXT_REQUEST = 'SEND_TEXT_REQUEST'
export const SEND_TEXT_SUCCESS = 'SEND_TEXT_SUCCESS'
export const SEND_TEXT_ERROR = 'SEND_TEXT_ERROR'

export function sendTextRequest () {
  return {
    type: SEND_TEXT_REQUEST
  }
}

export function sendTextSuccess (payload) {
  return {
    type: SEND_TEXT_SUCCESS,
    payload
  }
}

export function sendTextError (error) {
  return {
    type: SEND_TEXT_ERROR,
    error
  }
}

export function sendText (nexmoClientContext, room, message) {
  const nexmoClient = nexmoClientContext.nexmoClient
  return async function (dispatch) {
    dispatch(sendTextRequest())
    try {
      await nexmoClient.application.getConversations()
      const conversation = nexmoClientContext.nexmoClient.application.conversations.get(room.id)
      let member = conversation.me
      if (conversation.me.state === 'INVITED') {
        member = await conversation.join()
      }
      const username = member ? member.user.name : 'unknown'
      const payload = {
        roomId: conversation.id,
        data: {
          username,
          message
        }
      }
      payload.data.isSpam = await nexmoClientContext.nexmoClient.sphamlet.predict(payload.data.message)
      console.log(payload.data.isSpam)
      conversation.sendText(message)
      dispatch(updateChatLog(payload))
    } catch (error) {
      dispatch(sendTextError(error))
    }
  }
}

export const SET_USERNAME = 'SET_USERNAME'

export function setUsername (username) {
  return {
    type: SET_USERNAME,
    username
  }
}

export const SEND_MESSAGE_REQUEST = 'SEND_MESSAGE_REQUEST'
export const UPDATE_CHAT_LOG = 'UPDATE_CHAT_LOG'

export function updateChatLog (update) {
  return {
    type: UPDATE_CHAT_LOG,
    update
  }
}

// These are our action types
export const IP_CALL_REQUEST = 'IP_CALL_REQUEST'
export const IP_CALL_SUCCESS = 'IP_CALL_SUCCESS'
export const IP_CALL_ERROR = 'IP_CALL_ERROR'

// Now we define actions
export function ipCallRequest () {
  return {
    type: IP_CALL_REQUEST
  }
}

export function ipCallSuccess (payload) {
  return {
    type: IP_CALL_SUCCESS,
    payload
  }
}

export function ipCallError (error) {
  return {
    type: IP_CALL_ERROR,
    error
  }
}

export function ipCall (nexmoClient, phoneNumber) {
  return async function (dispatch) {
    dispatch(ipCallRequest())
    try {
      const call = await nexmoClient.application.callServer(phoneNumber)
      console.log(call)
      console.log('Calling phone ' + phoneNumber)
      dispatch(ipCallSuccess(call))
    } catch (error) {
      dispatch(ipCallError(error))
    }
  }
}

export function getUsers () {
  return async function (dispatch) {
    try {

    } catch (error) {
      // dispatch(ipCallError(error))
    }
  }
}

export const INVITE_USER_REQUEST = 'INVITE_USER_REQUEST'
export const INVITE_USER_SUCCESS = 'INVITE_USER_SUCCESS'
export const INVITE_USER_ERROR = 'INVITE_USER_ERROR'

export function inviteUserRequest () {
  return {
    type: INVITE_USER_REQUEST
  }
}

export function inviteUserSuccess (payload) {
  return {
    type: INVITE_USER_SUCCESS,
    payload
  }
}

export function inviteUserError (error) {
  return {
    type: INVITE_USER_ERROR,
    error
  }
}

export function inviteUser (nexmoClientContext, room, user) {
  const nexmoClient = nexmoClientContext.nexmoClient
  return async function (dispatch) {
    dispatch(inviteUserRequest())
    try {
      await nexmoClient.application.getConversations()
      const conversation = Array.from(nexmoClient.application.conversations.values()).find(e => e.name === room.name)
      const member = await conversation.invite({ user_name: user.nickname })
      const payload = {
        room: {
          name: conversation.name,
          id: conversation.id
        },
        username: member.user.name
      }
      dispatch(inviteUserSuccess(payload))
    } catch (error) {
      dispatch(inviteUserError(error))
    }
  }
}
