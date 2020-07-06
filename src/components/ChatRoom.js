import React, { useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUsername } from '../actions'
import { NexmoClientContext } from './NexmoClient'

function ChatRoom () {
  const [usernameInput, setUsernameInput] = useState('')
  const [msgInput, setMsgInput] = useState('')

  const room = useSelector(state => state.chatReducer.room)
  const username = useSelector(state => state.chatReducer.username)
  const chats = useSelector(state => state.chatReducer.chatLog)

  const dispatch = useDispatch()
  const nexmoClientContext = useContext(NexmoClientContext)

  function enterRooom () {
    dispatch(setUsername(usernameInput))
  }

  const sendText = () => {
    const conversation = nexmoClientContext.nexmoClient.application.conversations.get(room.id)
    nexmoClientContext.sendText(conversation, {
      username: username,
      message: msgInput
    })
  }

  return (
    <div>
      <h3>{room.name} ({room.id})</h3>
      {!username &&
        <div className='user'>
          <input type='text' placeholder='Enter username' value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
          <button onClick={enterRooom}>Enter Room</button>
        </div>}
      {username &&
        <div className='room'>
          <div className='history' style={{ width: '400px', border: '1px solid #ccc', height: '100px', textAlign: 'left', padding: '10px', overflow: 'scroll' }}>
            {chats.map((c, i) => (
              <div key={i}><i>{c.username}:</i> {c.message}</div>
            ))}
          </div>
          <div className='control'>
            <input type='text' value={msgInput} onChange={(e) => setMsgInput(e.target.value)} />
            <button onClick={sendText}>Send</button>
          </div>
        </div>}

    </div>
  )
}

export default ChatRoom
