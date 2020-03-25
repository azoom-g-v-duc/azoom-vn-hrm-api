import {
  user as userReq,
  saveUser,
  isValidUser
} from '@cloudStoreDatabase/user'

const bcrypt = require('bcrypt')
const _ = require('lodash')

module.exports = async (req, res) => {
  const data = _.defaultsDeep(req.body, userReq)
  if (await isValidUser(data.id, data.email)) {
    saveUser(data)
    return res.send(data)
  }
  return res.sendStatus(400)
}