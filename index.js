const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const qrcode = require('qrcode-terminal')
const groupHandler = require('./handler/group')
const commandHandler = require('./handler/command')

async function startBot() {
  const { version } = await fetchLatestBaileysVersion()
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')

  const sock = makeWASocket({
    version,
    auth: state
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update
    if (qr) qrcode.generate(qr, { small: true })
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error instanceof Boom
        ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        : true
      if (shouldReconnect) startBot()
    } else if (connection === 'open') {
      console.log('✅ Bot connected!')
    }
  })

  sock.ev.on('group-participants.update', (data) => groupHandler(sock, data))
  sock.ev.on('messages.upsert', (m) => commandHandler(sock, m))
}

startBot()
