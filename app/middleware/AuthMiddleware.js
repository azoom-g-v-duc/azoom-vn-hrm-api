/**
 * src/controllers/auth.js
 */
import { verifyToken  } from '@helpers/jwt.helper'
import express from 'express'

const router = new express.Router()

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

/**
 * Middleware: Authorization user by Token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const authMiddleware = router.use((req, res, next) => {
  console.log("************************")
  const url= req.header('Referer') || req.headers.referer
  console.log(url)
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if(checkRequestReferer(req.originalUrl)){
    return next()
  }
  if (checkRequestApiKey(tokenFromClient)) {
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
      const decoded = await verifyToken(tokenFromClient, accessTokenSecret);
      return req.jwtDecoded = decoded;
    } catch (error) {
      return false
      // debug("Error while verify token:", error);
      // return res.send("Unauthorized");
    }
  }

