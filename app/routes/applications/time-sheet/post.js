import {
  timesheetApplication as timeAppReq,
  isValidTsA,
  saveTimesheetApplication
} from '@cloudStoreDatabase/timesheet-application'

const _ = require('lodash')

module.exports = async (req, res) => {
  const data = _.defaultsDeep(req.body, timeAppReq)
  data.userId = req.user.id
  if (await isValidTsA(data.id, data.email)) {
    saveTimesheetApplication(data)
    return res.send(data)
  }
  return res.sendStatus(400)
}
