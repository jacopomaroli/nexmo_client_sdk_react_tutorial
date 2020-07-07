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
      // console.log(nexmoClient.application)
      await nexmoClient.application.getConversations()
      // const conversations = await nexmoClient.application.getConversations()
      // console.log(conversations)
      // const conversation = await nexmoClient.application.getConversation(roomId)
      // debugger
      const conversation = Array.from(nexmoClient.application.conversations.values()).find(e => e.name === roomId)
      // if (!conversation) throw new Error('Can\'t find conversation')
      // console.log(conversation)
      // console.log(nexmoClient.application.me)
      // const member = await conversation.join()
      nexmoClientContext.selectConversation(conversation)
      const member = conversation.me
      // console.log(member)
      const payload = {
        room: {
          name: conversation.name,
          id: conversation.id
        },
        username: member.id
      }
      dispatch(joinRoomSuccess(payload))
    } catch (error) {
      dispatch(joinRoomError(error))
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
