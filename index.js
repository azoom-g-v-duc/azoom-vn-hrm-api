const nnn = require('nnn-router')
const express = require('express')
const app = express()

// module.exports = require('@app/main')

const options = {
  routeDir: '/app/routes',
}

app.use(nnn(options))

app.listen(8080)