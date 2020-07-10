import React, { useContext } from 'react'
import Async from 'react-async'
import { useDispatch, useSelector } from 'react-redux'
import { NexmoClientContext } from './NexmoClient'
import { hideInviteModal } from '../redux'
import { inviteUser } from '../actions'

async function getUsers (auth0Token) {
  const res = await fetch('/.netlify/functions/users', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ jwt: auth0Token.auth0Token })
  })
  if (!res.ok) { throw res }
  return res.json()
}

const InviteUserModal = () => {
  const auth0Token = useSelector(state => state.UI.auth0Token)
  const currentRoom = useSelector(state => state.chatReducer.room)
  const dispatch = useDispatch()
  const nexmoClientContext = useContext(NexmoClientContext)

  return (
    <div className='modal getUsers'>
      <div className='header'>
        <span className='title'>Invite a user</span>
        <button className='close' onClick={() => dispatch(hideInviteModal())}><i className='fa fa-times' aria-hidden='true' /></button>
      </div>
      <Async promiseFn={() => getUsers(auth0Token)}>
        {({ data, err, isLoading }) => {
          if (isLoading) return 'Loading...'
          if (err) return `Something went wrong: ${err.message}`
          if (data) {
            return (
              <div className='usersListContainer'>
                <ul>
                  {data.map(function (user, index) {
                    return (
                      <li key={index}>
                        <button onClick={() => { dispatch(inviteUser(nexmoClientContext, currentRoom, user)); dispatch(hideInviteModal()) }}>{user.nickname}</button>
                      </li>)
                  })}
                </ul>
              </div>
            )
          }
        }}
      </Async>
    </div>
  )
}

export { InviteUserModal }
