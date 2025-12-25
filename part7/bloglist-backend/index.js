const app = require('./app')
const mongoose = require('mongoose')
const config = require('./utils/config')

mongoose.connect(config.MONGODB_URI, { family: 4 })

const PORT = config.PORT || 3003
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }