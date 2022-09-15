import { S_WHATSAPP_NET } from '@adiwajshing/baileys'
import { Request, Response } from 'express'
import Wa from '../libs/Wa'

class MessageController {
  /**
   * Index page of messages
   *
   * @param req Request
   * @param res Response
   */
  public index(req: Request, res: Response) {
    res.json({
      Hello: 'World',
    })
  }

  public async send(req: Request, res: Response) {
    const phone = req.body?.phone + S_WHATSAPP_NET
    const message = req.body?.message

    const isValid = !!(await Wa.socket?.onWhatsApp(phone))

    if (!isValid) {
      res.status(422).json({
        status: 400,
        message: 'Number is not valid',
      })
    }

    try {
      await Wa.socket?.sendMessage(phone, {
        text: message,
      })

      res.json({
        status: 200,
        message: 'Success send message',
      })
    } catch (err) {}

    // Wa.socket?.sendMessage()
  }
}

export default new MessageController()
