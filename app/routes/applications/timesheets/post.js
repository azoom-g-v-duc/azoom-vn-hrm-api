import { timesheetApplication as timeAppReq } from '@constants/models'
import {timesheetApplicationCollection} from '@root/database'

const _ = require('lodash/fp')

module.exports = async (req, res) => {
  const data = _.defaultsDeep(timeAppReq, req.body)
  data.userId = req.user.id
  if (await isValidTsA(data.id, data.email)) {
    saveTimesheetApplication(data)
    return res.send(data)
  }
  return res.sendStatus(400)
}
const setId = (id) => {
  return id + date.format(new Date(), 'YYYYMMDDHHMMSS')
}

//TODO validate data
const isValidTsA = async (data) => {
  return true
}

const saveTimesheetApplication = async data => {
  data.id = setId(data.userId)
  const users = await timesheetApplicationCollection()
    .doc(data.id)
    .set(data)
  return users
}
