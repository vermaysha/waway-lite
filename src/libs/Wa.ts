import makeWASocket, {
  Browsers,
  DisconnectReason,
  makeInMemoryStore,
  useMultiFileAuthState,
} from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import P from 'pino'
import { cwd } from 'process'
import { resolve as pathResolve } from 'path'

class Wa {
  /**
   * Baileys object
   *
   * @param socket object | undefined
   */
  public socket: ReturnType<typeof makeWASocket> | undefined

  /**
   * WAConnectionState: "open" | "connecting" | "close"
   *
   * @param connectionStatus strin
   */
  public connectionStatus: string = 'connecting'

  /**
   * Make connection to whatsapp server
   *
   * @returns Promise<object>
   */
  public connect(): Promise<ReturnType<typeof makeWASocket>> {
    return new Promise(async (resolve, reject) => {
      if (this.socket !== undefined) {
        return this.socket
      }

      console.log('Connecting to whatsapp client')

      const { state, saveCreds } = await useMultiFileAuthState(
        pathResolve(cwd(), 'session')
      )

      const store = makeInMemoryStore({
        logger: P().child({ level: 'warn' }),
      })

      store.readFromFile(pathResolve(cwd(), './store.json'))

      setInterval(() => {
        store.writeToFile(pathResolve(cwd(), './store.json'))
      }, 10_000)

      const sock = makeWASocket({
        auth: state,
        downloadHistory: true,
        markOnlineOnConnect: true,
        // userDevicesCache: NodeCache,
        syncFullHistory: true,
        browser: Browsers.appropriate('Desktop'),
        printQRInTerminal: true,
        logger: P({
          level: 'warn',
        }),
      })

      store.bind(sock.ev)

      sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
          console.log('closed connection')
          this.connectionStatus = 'close'
          const shouldReconnect =
            (lastDisconnect?.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut

          // reconnect if not logged out
          if (shouldReconnect) {
            console.log('you should reconnect')
            this.connect()
          } else {
            reject(new Error(lastDisconnect?.error?.message))
          }
        } else if (connection === 'open') {
          console.log('opened connection')
          this.connectionStatus = 'open'
          this.socket = sock
          resolve(sock)
        } else if (connection === 'connecting') {
          console.log('connecting to whatsapp')
          this.connectionStatus = 'connecting'
        }
      })

      sock.ev.on('creds.update', saveCreds)
    })
  }
}

export default new Wa()
