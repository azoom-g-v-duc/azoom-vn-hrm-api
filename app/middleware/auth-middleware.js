import { verifyToken  } from '@helpers/jwt-helper'
import express from 'express'

const router = new express.Router()

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

export const authMiddleware = router.use( async(req, res, next) => {
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if(checkRequestReferer(req.originalUrl))
  {
    return next()
  }
  console.log(tokenFromClient)
  console.log(await checkRequestApiKey(tokenFromClient))
  if (await checkRequestApiKey(tokenFromClient)) {
    return next()
  }
  return res.send("No token provided.");
})

function checkRequestReferer(requestReferer) {
  const isProduction = process.env.NODE_ENV === 'production'
  const defaultApiRefererWhitelist = [
    /^(https?:\/\/)?([\w-.]*)\/login/
  ]
  const apiRefererWhiteList = isProduction
    ? defaultApiRefererWhitelist
    : [...defaultApiRefererWhitelist, /login/]
  console.log(apiRefererWhiteList)
  return (
    requestReferer &&
    apiRefererWhiteList.some(referer => referer.test(requestReferer))
  )
}

async function  checkRequestApiKey(tokenFromClient) {
   try {
      const user = await verifyToken(tokenFromClient, accessTokenSecret)
      return {tokenFromClient,user}
    } catch (error) {
      return false
    }
  }

