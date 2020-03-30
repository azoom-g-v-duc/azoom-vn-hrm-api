import {
  updateTimesheet,
  savetimeSheet,
  getTimesheetUserday,
  timeSheet as timeSheetReq
} from '@cloudStoreDatabase/time-sheet'
const date = require('date-and-time')

module.exports = async (req, res) => {
  timeSheetReq.endTime = date.format(new Date(), 'HH:mm:ss')
  if (await getTimesheetUserday(req.user.id, new Date())) {
    await updateTimesheet(req.user, { endTime: timeSheetReq.endTime })
  } else {
    savetimeSheet(req.user, timeSheetReq)
  }
  return res.send({ message: 'Checkin successfully.' })
}
