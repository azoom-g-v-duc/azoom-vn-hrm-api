import express from 'express'
import { verifyToken } from '@helpers/jwt-helper'
import getToken from '@routes/authentications/tokens/get'

const router = new express.Router()

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

export const authMiddleware = router.use(async (req, res, next) => {
  const tokenFromClient =
    req.body.token || req.query.token || req.headers['x-access-token'] || ''
  if (checkRequestReferer(req.originalUrl)) {
    return next()
  }
  const resultcheck = await checkRequestApiKey(tokenFromClient)
  if (resultcheck) {
    req.user = resultcheck.user
    req.token = resultcheck.token
    return next()
  }
  return res.status(401).send('No token provided.')
})

function checkRequestReferer (requestReferer) {
  const isProduction = process.env.NODE_ENV === 'production'
  const defaultApiRefererWhitelist = [/^(https?:\/\/)?([\w-.]*)\/login|pubsub/]
  const apiRefererWhiteList = isProduction
    ? defaultApiRefererWhitelist
    : [...defaultApiRefererWhitelist, /login/]
  return (
    requestReferer &&
    apiRefererWhiteList.some(referer => referer.test(requestReferer))
  )
}

async function checkRequestApiKey (tokenFromClient) {
  try {
    const user = await verifyToken(tokenFromClient, accessTokenSecret)
    const token = await getToken(user.id, tokenFromClient)
    if (token) {
      return { user: user, token: token }
    }
    return false
  } catch (error) {
    console.log(error)
    return false
  }
}
