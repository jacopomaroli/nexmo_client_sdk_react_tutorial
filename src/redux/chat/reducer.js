import { CREATE_ROOM_SUCCESS, JOIN_ROOM_SUCCESS, SET_USERNAME, UPDATE_CHAT_LOG } from './actions'

const initialState = {
  room: null,
  chatLog: [],
  username: null
}

export const chatReducer = function (state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }

  switch (action.type) {
    case CREATE_ROOM_SUCCESS:
      return {
        ...state,
        room: action.payload.room,
        chatLog: []
      }

    case JOIN_ROOM_SUCCESS:
      return {
        ...state,
        room: action.payload.room,
        username: action.payload.username,
        chatLog: []
      }

    case SET_USERNAME:
      return {
        ...state,
        username: action.payload.username
      }

    case UPDATE_CHAT_LOG:
      if (state.room !== null && action.update.roomId === state.room.id) {
        return {
          ...state,
          chatLog: [...state.chatLog, action.update.data]
        }
      }
      return state

    default:
      return state
  }
}
