import './App.scss'
import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from './redux/hooks'
import { dataActions } from './redux/slice/userDataSlice'
import socket from './util/socketSingleton'
import AppForm from './pages/AppForm'
import Chat from './pages/Chat'
import Alerts from './components/Alerts'
import { logout } from './redux/thunk'
import { IMessage } from '@chatapp/shared'
import { messagesActions } from './redux/slice/messagesSlice'
import { CHAP_APP_LAST_ONLINE } from './util/constants'
import { refreshTokens } from './util/functions'
import { alertActions } from './redux/slice/alertSlice'

function App() {

  const connected = useAppSelector(state => state.userData.socketConnected)
  const username = useAppSelector(state => state.userData.username)
  const dispatch = useAppDispatch()

  const onConnectEvent = () => {
    dispatch(dataActions.setSocketConnected(true))
  }

  const onDisconnectEvent = () => {
    dispatch(dataActions.setSocketConnected(false))
  }

  const onMessageEvent = (msg: IMessage) => {
    dispatch(messagesActions.addMessage(msg))
  }

  const onUsersUpdateEvent = (users: string[]) => {
    console.log("users update", users)
    users = users.filter(user => user !== username)
    dispatch(messagesActions.usersUpdate(users))
  }

  const handleTest = async () => {
    socket.emit("test")
    socket.emit("message", {
      id: "1",
      RoomId: "2",
      sender: "3",
      text: "4"
    })
    dispatch(alertActions.addAlert({
      message: "testing",
      severity: 'success'
    }))
    dispatch(alertActions.addAlert({
      message: "testing",
      severity: 'info'
    }))
    dispatch(alertActions.addAlert({
      message: "testing",
      severity: 'warning'
    }))
    dispatch(alertActions.addAlert({
      message: "testing",
      severity: 'error'
    }))
  }

  const handleLogout = () => {
    dispatch(logout())

  }

  const onTestEvent = () => {
    console.log("test from server")
  }

  const connectSocket = async () => {
    const JWT = await refreshTokens()
    if (!JWT) {
      localStorage.removeItem(CHAP_APP_LAST_ONLINE)
      return
    }
    dispatch(dataActions.setJWT(JWT))
    socket.connect(JWT)
  }

  useEffect(() => {
    socket.on('connect', onConnectEvent)
    socket.on('disconnect', onDisconnectEvent)
    socket.on("message", onMessageEvent)
    socket.on("usersUpdate", onUsersUpdateEvent)
    socket.on("test", onTestEvent)

    const username = localStorage.getItem(CHAP_APP_LAST_ONLINE)
    if (username) connectSocket()
    return () => {
      socket.disconnect()
      socket.off('connect', onConnectEvent)
      socket.off('disconnect', onDisconnectEvent)
      socket.off("message", onMessageEvent)
      socket.off("usersUpdate", onUsersUpdateEvent)
      socket.off("test", onTestEvent)
    }
  }, [])

  return (
    <div className="App">
      <Alerts />
      {connected ?
        <Chat /> :
        <div className="appFormContainer">
          <AppForm />
        </div>
      }
      <div id='temporary'>
        <button onClick={handleTest}>test</button>
        <button onClick={handleLogout}>logout</button>
      </div>
    </div>
  )
}

export default App