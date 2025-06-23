module.exports = async (sock, { messages }) => {
  const msg = messages[0]
  if (!msg.message) return
  const from = msg.key.remoteJid
  const text = msg.message.conversation || msg.message.extendedTextMessage?.text
  console.log('📩 Received:', text)

  if (text === 'halo') {
    await sock.sendMessage(from, { text: 'Halo juga!' })
  } else if (text === 'ping') {
    await sock.sendMessage(from, { text: 'Pong!' })
  }
}
