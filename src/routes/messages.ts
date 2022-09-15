import { Router } from 'express'
import MessageController from '../controllers/Message.controller'
const router = Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

router.get('/', MessageController.index)
router.post('/send', MessageController.send)

export default router
