const axios = require('axios')

async function getQuote() {
  const res = await axios.get('https://api.quotable.io/random')
  return `${res.data.content} — ${res.data.author}`
}

module.exports = { getQuote }
