import React, { useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import { NexmoClientContext } from './NexmoClient'

function ChatRoom () {
  const [msgInput, setMsgInput] = useState('')

  const room = useSelector(state => state.chatReducer.room)
  const username = useSelector(state => state.chatReducer.username)
  const chats = useSelector(state => state.chatReducer.chatLog)

  const msgInputRef = React.createRef()

  const nexmoClientContext = useContext(NexmoClientContext)

  const sendText = () => {
    const conversation = nexmoClientContext.nexmoClient.application.conversations.get(room.id)
    nexmoClientContext.sendText(conversation, {
      username: username,
      message: msgInput
    })
    msgInputRef.current.innerHTML = ''
  }

  return (
    <>
      <div className='roomName'>{room.name}</div>
      <div className='historyWrapper'>
        <div className='history'>
          {chats.map((c, i) => (
            <div className='historyEvent' key={i}>
              <div className='username'>{c.username}</div>
              <div className='message' dangerouslySetInnerHTML={{ __html: c.message }} />
            </div>
          ))}
        </div>
      </div>
      <div className='control'>
        <div className='msgInput' ref={msgInputRef} contentEditable value={msgInput} onInput={(e) => setMsgInput(e.target.innerHTML)} />
        <button onClick={sendText}><i className='fa fa-paper-plane' aria-hidden='true' /></button>
      </div>
    </>
  )
}

export default ChatRoom
