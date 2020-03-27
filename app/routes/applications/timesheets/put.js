import {
  timesheetApplication as timeAppReq,
  isValidTsA,
  updateTsApp
} from '@cloudStoreDatabase/timesheet-application'

const _ = require('lodash')

module.exports = async (req, res) => {
  const data = _.defaultsDeep(req.body, timeAppReq)
  data.userId = req.user.id
  if (await isValidTsA()) {
    const result = await updateTsApp(data)
    if (await result) return res.send(result)
  }
  return res.sendStatus(400)
}
