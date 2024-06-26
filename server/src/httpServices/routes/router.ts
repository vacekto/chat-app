import { Router } from 'express'
import * as controllers from '../controllers'
import { middlewareErrorDecorator } from '../middleware/errorDecorator'

const router = Router()

router.get('/healthCheck', (req, res, next) => {
    res.status(200).send('OK')
})

router.get('/test', middlewareErrorDecorator(controllers.test))
router.post('/refreshToken', middlewareErrorDecorator(controllers.refreshToken))
router.post('/logout', middlewareErrorDecorator(controllers.logout))
router.post('/register', middlewareErrorDecorator(controllers.register))
router.post('/passwordLogin', middlewareErrorDecorator(controllers.passwordLogin))
router.post('/passkeyLogin', middlewareErrorDecorator(controllers.passkeyLogin))
router.post('/createPassKey', middlewareErrorDecorator(controllers.createPassKey))
router.get('/OAuth', middlewareErrorDecorator(controllers.OAuth2Callback))
router.get('/googleLogin', middlewareErrorDecorator(controllers.googleLogin))

export default router