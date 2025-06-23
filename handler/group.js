module.exports = (sock, data) => {
  console.log('👥 Group update:', data)
  const { id, participants, action } = data
  participants.forEach(async (user) => {
    if (action === 'add') {
      await sock.sendMessage(id, { text: `Selamat datang <@${user.split('@')[0]}> 👋`, mentions: [user] })
    } else if (action === 'remove') {
      await sock.sendMessage(id, { text: `Selamat tinggal <@${user.split('@')[0]}> 😢`, mentions: [user] })
    }
  })
}
