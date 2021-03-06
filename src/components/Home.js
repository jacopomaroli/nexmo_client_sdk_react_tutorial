import React, { useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createRoom, joinRoom, ipCall } from '../redux/chat/actions'
import ChatRoom from './ChatRoom'
import { NexmoClientContext } from './NexmoClient'

async function doLogin (nexmoClientContext, nexmoToken, setConversationList) {
  await nexmoClientContext.login(nexmoToken)
  if (!nexmoClientContext.nexmoClient.application) return

  const conversationList = nexmoClientContext.nexmoClient.application.conversations
  setConversationList(conversationList)
}

function Home () {
  const [roomName, setRoomName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(process.env.REACT_APP_NEXMO_PHONE_NUMBER)
  const [conversationList, setConversationList] = useState([])
  const currentRoom = useSelector(state => state.chat.room)
  const nexmoToken = useSelector(state => state.login.nexmoToken)

  const dispatch = useDispatch()

  const nexmoClientContext = useContext(NexmoClientContext)
  doLogin(nexmoClientContext, nexmoToken, setConversationList)

  return (
    <div id='page'>
      <div id='sidebar'>
        <div id='callPhone'>
          <input type='text' placeholder='Phone number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <button onClick={() => dispatch(ipCall(nexmoClientContext.nexmoClient, phoneNumber))}><i className='fa fa-phone' aria-hidden='true' /></button>
        </div>
        <div id='newRoom'>
          <input type='text' placeholder='Room name' value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <button onClick={() => dispatch(createRoom(nexmoClientContext.nexmoClient, roomName))}><i className='fa fa-plus' aria-hidden='true' /></button>
        </div>
        <ul id='roomsList'>
          {[...conversationList.values()].map(function (conversation, index) {
            const selected = currentRoom && currentRoom.name === conversation.name ? 'selected' : ''
            return (
              <li key={index}>
                <button className={`${selected}`} onClick={() => dispatch(joinRoom(nexmoClientContext, conversation.name))}>{conversation.name}</button>
              </li>)
          })}
        </ul>
      </div>
      <div id='main'>
        {currentRoom &&
          <ChatRoom />}
      </div>
    </div>
  )
}

export default Home
