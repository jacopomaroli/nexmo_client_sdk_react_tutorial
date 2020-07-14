import React, { useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NexmoClientContext } from './NexmoClient'
import { showInviteModal } from '../redux/ui'
import { loadOlder, sendText } from '../redux/chat/actions'

const rolesNamespace = `${process.env.REACT_APP_AUTH0_CLAIM_NAMESPACE}/roles`

function ChatRoom () {
  const [msgInput, setMsgInput] = useState('')

  const room = useSelector(state => state.chat.room)
  const chats = useSelector(state => state.chat.chatLog)
  const chatLogCursor = useSelector(state => state.chat.chatLogCursor)
  const auth0Claims = useSelector(state => state.login.auth0Claims)

  const dispatch = useDispatch()
  const msgInputRef = React.createRef()

  const nexmoClientContext = useContext(NexmoClientContext)
  const isAgent = auth0Claims[rolesNamespace] && auth0Claims[rolesNamespace].includes('Agent')

  const sendTextComponent = () => {
    if (!msgInput) return
    dispatch(sendText(nexmoClientContext, room, msgInput))
    msgInputRef.current.innerHTML = ''
    setMsgInput(msgInputRef.current.innerHTML)
  }

  const msgInputKeyPressed = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      sendTextComponent()
      e.preventDefault()
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
    }
  }

  return (
    <>
      <div className='roomHeader'>
        <div className='roomName'>{room.name}</div>
        {isAgent &&
          <button className='addMemberButton' onClick={() => dispatch(showInviteModal())}><i className='fa fa-user-plus' aria-hidden='true' /></button>}
      </div>
      <div className='historyWrapper'>
        <div className='history'>
          <div className='loadOlder'><button onClick={() => dispatch(loadOlder(nexmoClientContext, room.name, chatLogCursor.next))}>Load older</button></div>
          {chats.map((c, i) => (
            <div className='historyEvent' key={i}>
              <div className='username'>{c.username}</div>
              <div className='message' dangerouslySetInnerHTML={{ __html: c.message }} />
            </div>
          ))}
        </div>
      </div>
      <div className='control'>
        <div className='msgInput' ref={msgInputRef} contentEditable tabIndex='0' value={msgInput} onInput={(e) => setMsgInput(e.target.innerHTML)} onKeyDown={msgInputKeyPressed} />
        <button onClick={sendTextComponent}><i className='fa fa-paper-plane' aria-hidden='true' /></button>
      </div>
    </>
  )
}

export default ChatRoom
