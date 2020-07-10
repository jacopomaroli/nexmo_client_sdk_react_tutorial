import React, { useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NexmoClientContext } from './NexmoClient'
import { showInviteModal } from '../redux'

const rolesNamespace = `${process.env.REACT_APP_AUTH0_CLAIM_NAMESPACE}/roles`

function ChatRoom ({ Auth0User }) {
  const [msgInput, setMsgInput] = useState('')

  const room = useSelector(state => state.chatReducer.room)
  const username = useSelector(state => state.chatReducer.username)
  const chats = useSelector(state => state.chatReducer.chatLog)

  const dispatch = useDispatch()
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

  const isAgent = Auth0User[rolesNamespace] && Auth0User[rolesNamespace].includes('Agent')

  return (
    <>
      <div className='roomHeader'>
        <div className='roomName'>{room.name}</div>
        {isAgent &&
          <button className='addMemberButton' onClick={() => dispatch(showInviteModal())}><i className='fa fa-user-plus' aria-hidden='true' /></button>}
      </div>
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
