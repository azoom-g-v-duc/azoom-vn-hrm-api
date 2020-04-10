import express from 'express'
import nnnRouter from 'nnn-router'
import promiseRouter from 'express-promise-router'
import cors from 'cors'
import bodyParser from 'body-parser'
import expressOpenApiMiddleware from 'openapi-express-middleware'
import swaggerFile from './openapi.json'
const firebase = require('firebase')

import statuses from 'statuses'

import { authMiddleware } from '@middleware/auth'

firebase.initializeApp({
  apiKey: process.env.FIRE_BASE_API_KEY,
  authDomain: process.env.FIRE_BASE_AUTH_DOMAIN,
  databaseURL: process.env.FIRE_BASE_DATABASE_URL,
  projectId: process.env.FIRE_BASE_PROJECT_ID,
  storageBucket: process.env.FIRE_BASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIRE_BASE_MESSAGING_SENDER_ID,
  appId: process.env.FIRE_BASE_APP_ID
})

express.response.sendStatus = function (statusCode) {
  const body = { message: statuses[statusCode] || String(statusCode) }
  this.statusCode = statusCode
  this.type('json')
  this.send(body)
}

const app = express()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(
  cors({
    origin: true,
    credential: true
  }),
  (error, req, res, next) => {
    if (error) {
      return res.status(400).json({
        message: error.message
      })
    }
    next()
  }
)

app.use(authMiddleware)

app.use(
  expressOpenApiMiddleware(swaggerFile, app, {
    enableBodyParser: false,
    enableValidateRequest: false
  }),
  (error, req, res, next) => {
    if (error) {
      return res.status(400).json({
        message: error.message,
      })
    }
    return next()
  }
)

app.use(
  nnnRouter({ routeDir: '/routes', baseRouter: promiseRouter() }),
  (error, req, res, next) => {
    console.error(error)
    return res.sendStatus(500)
  }
)

app.listen(process.env.PORT || 8080, err => {
  if (err) {
    return console.error(err)
  }
})

export default app
