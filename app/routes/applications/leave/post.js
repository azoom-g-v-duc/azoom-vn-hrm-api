import {
  leaveApplication as leaveAppReq,
  isValidTsA,
  saveLeaveApplication
} from '@cloudStoreDatabase/leave-application'

const _ = require('lodash')

module.exports = async (req, res) => {
  const data = _.defaultsDeep(req.body, leaveAppReq)
  data.userId = req.user.id
  if (await isValidTsA(data.id, data.email)) {
    await saveLeaveApplication(data)
    return res.send(data)
  }
  return res.sendStatus(400)
}
