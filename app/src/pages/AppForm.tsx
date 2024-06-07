import './AppForm.scss'
import Switch from '../components/Switch'
import LoginFrom from '../components/Login'
import RegisterFrom from '../components/Register'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { dataActions } from '../redux/slice/userDataSlice'

export type TFormAction = 'loginAction' | 'registerAction'

const AppForm: React.FC = () => {
  const formAction = useAppSelector(state => state.userData.formAction)
  const dispatch = useAppDispatch()

  const setAction = (action: TFormAction) => {
    dispatch(dataActions.setFormAction(action))
  }

  const switchCb = (activeSide: 'left' | 'right') => {
    const newAction = activeSide === 'left' ? 'loginAction' : 'registerAction'
    setAction(newAction)
  }

  return <div className='AppForm'>
    <div className="header">
      <div className="headerText">
        <div onClick={() => setAction("loginAction")}>Log in</div>
        <div onClick={() => setAction("registerAction")}>Register</div>
      </div>

      <Switch
        state={formAction === 'loginAction' ? 'left' : 'right'}
        cb={switchCb}
      />
    </div>

    <div className={`formContainer ${formAction}`}>

      <div className='forms'>
        <LoginFrom />
        <RegisterFrom />
      </div>
    </div>
  </div>
}

export default AppForm