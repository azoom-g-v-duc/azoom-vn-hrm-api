import {
  timeSheet as timeSheetReq,
  savetimeSheet,
} from '@cloudStoreDatabase/time-sheet'
const date = require('date-and-time')

const _ = require('lodash')

module.exports = async (req, res) => {
  timeSheetReq.stateTime = date.format(new Date(), 'HH:mm:ss')
  await savetimeSheet(req.user, timeSheetReq)
  return res.sendStatus(200)
}
