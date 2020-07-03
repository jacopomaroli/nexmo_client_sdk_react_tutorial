import React from 'react'

const Me = ({ me }) => {
  if (!me) { return <div>Who am I?</div> }
  return <div>{me.name}</div>
}

class NexmoClientWidget extends React.Component {
  constructor () {
    super()
    this.state = {
      me: null,
      nexmoApp: null
    }
    this.nexmoLogin = this.nexmoLogin.bind(this)
    this.ipCall = this.ipCall.bind(this)
  }

  async ipCall () {
    const { nexmoApp } = this.state
    const phoneNumber = '447418343258'
    const call = await nexmoApp.callServer(phoneNumber)
    // this.addConversationNode(call.conversation);
    console.log('Calling phone ' + phoneNumber)
  }

  async nexmoLogin () {
    const NexmoClient = require('nexmo-client')
    const nexmoClient = new NexmoClient({ debug: false })

    const nexmoApp = await nexmoClient.login(this.props.token)
    console.log('app: ', nexmoApp)
    window.nexmoApp = nexmoApp
    this.setState((state, props) => {
      return {
        ...this.state,
        me: {
          name: nexmoApp.me.name,
          id: nexmoApp.me.id
        },
        nexmoApp
      }
    })

    nexmoApp.on('*', (event, evt) => {
      console.log('event: ', event, evt)
      console.log('nexmoApp.activeStreams.length ', nexmoApp.activeStreams.length)
    })
  }

  componentDidMount () {
    const isServer = typeof window === 'undefined'
    if (!isServer) {
      this.nexmoLogin()
    }
  }

  render () {
    return (
      <div>
        <h2>ClientSDK Tutorial</h2>
        <Me me={this.state.me} />
        <button onClick={this.ipCall}>call</button>
      </div>
    )
  }
}

export default NexmoClientWidget
