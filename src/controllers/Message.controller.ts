import { S_WHATSAPP_NET } from '@adiwajshing/baileys'
import { Request, Response } from 'express'
import Wa from '../libs/Wa'
import Message from '../models/Message'

class MessageController {
  /**
   * Index page of messages
   *
   * @param req Request
   * @param res Response
   */
  public async index(req: Request, res: Response) {
    const messages = await Message.findAll()
    res.json(messages)
  }

  public async send(req: Request, res: Response): Promise<Response> {
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
      const response = await Wa.socket?.sendMessage(phone, {
        text: message,
      })

      const msg = await Message.create({
        jid: phone,
        message: message,
        response: response,
        status: 'sent',
      })

      return res.json({
        status: 200,
        message: 'Message has been sent',
        id: msg?.id,
      })
    } catch (err) {
      return res.status(400).json(err)
    }
  }

  /**
   *
   * @param req Request
   * @param res Response
   * @returns Response
   */
  public async unsend(req: Request, res: Response): Promise<Response> {
    const id: number = Number(req.query.id)
    const message = await Message.findByPk(id)

    if (message == null) {
      return res.status(404).json({
        message: 'Data not found',
      })
    }

    await Wa.socket?.sendMessage(message.jid, { delete: message.response.key })

    await message.update({
      status: 'deleted',
    })

    return res.json({
      status: 200,
      message: 'message has been deleted',
    })
  }
}

export default new MessageController()
