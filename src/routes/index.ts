import { Express } from 'express'
import messages from './messages'
import Wa from '../libs/Wa'

export default (express: Express) => {
  express.get('/', (req, res) => {
    res.json({
      deviceStatus: Wa.connectionStatus,
    })
  })

  /**
   * Middleware to check connectionStatus must be
   */
  express.use((req, res, next) => {
    if (Wa.connectionStatus == 'connecting') {
      res.status(400).json({
        status: 400,
        message: 'Device is not ready, please wait a minute.',
      })
    } else if (Wa.connectionStatus == 'close') {
      res.status(400).json({
        status: 400,
        message:
          'The device has not been authenticated, please scan the qr code in terminal.',
      })
    } else {
      next()
    }
  })

  express.use('/messages', messages)
}
