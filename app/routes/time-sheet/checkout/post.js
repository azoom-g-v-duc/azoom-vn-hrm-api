import {
  checkoutTimesheet,
  savetimeSheet,
  checkTimesheetdoc,
  timeSheet as timeSheetReq,
} from '@cloudStoreDatabase/time-sheet'
const date = require('date-and-time')

module.exports = async (req, res) => {
  timeSheetReq.endTime = date.format(new Date(), 'HH:mm:ss')
  if (!(await checkTimesheetdoc(req.user.id))) {
    timeSheetReq.startTime = ''
    return savetimeSheet(req.user, timeSheetReq)
  }
  if (!(await updateEndTime(req.user, timeSheetReq.endTime))) {
    savetimeSheet(req.user, timeSheetReq)
  }
  return res.sendStatus(200)
}
