import React, { useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createRoom, joinRoom, ipCall } from '../actions'
import ChatRoom from './ChatRoom'
import { NexmoClientContext } from './NexmoClient'

async function doLogin (nexmoClientContext, token, setUsername, setConversationList) {
  await nexmoClientContext.login(token)
  if (!nexmoClientContext.nexmoClient.application) return

  setUsername(nexmoClientContext.nexmoClient.application.me.name)

  const conversationList = nexmoClientContext.nexmoClient.application.conversations
  setConversationList(conversationList)
}

function Home ({ token }) {
  const [username, setUsername] = useState('Anonymous')
  const [roomName, setRoomName] = useState('')
  const [roomId, setRoomId] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('447418343258')
  const [conversationList, setConversationList] = useState([])
  const currentRoom = useSelector(state => state.room)

  const dispatch = useDispatch()

  const nexmoClientContext = useContext(NexmoClientContext)
  doLogin(nexmoClientContext, token, setUsername, setConversationList)

  return (
    <>
      {!currentRoom &&
        <div className='create'>
          <div>
            Hello: {username}!
          </div>
          <div>
            <span>Call a phone</span>
            <input type='text' placeholder='Phone number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <button onClick={() => dispatch(ipCall(nexmoClientContext.nexmoClient, phoneNumber))}>Call</button>
          </div>
          <div>
            <span>Create new room</span>
            <input type='text' placeholder='Room name' value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            <button onClick={() => dispatch(createRoom(nexmoClientContext.nexmoClient, roomName))}>Create</button>
          </div>
          <div>
            <span>Join existing room</span>
            <input type='text' placeholder='Room code' value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            <button onClick={() => dispatch(joinRoom(nexmoClientContext.nexmoClient, roomId))}>Join</button>
          </div>
          <ul>
            {[...conversationList.values()].map(function (conversation, index) {
              return <li key={index}>{conversation.name}</li>
            })}
          </ul>
        </div>}

      {currentRoom &&
        <ChatRoom />}
    </>
  )
}

export default Home
