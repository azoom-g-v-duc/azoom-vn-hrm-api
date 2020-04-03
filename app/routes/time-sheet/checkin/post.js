import {
  updateTimesheet,
  savetimeSheet,
  getTimesheetUserday,
  timeSheet as timeSheetReq
} from '@cloudStoreDatabase/time-sheet'
const date = require('date-and-time')

module.exports = async (req, res) => {
  const data = await getTimesheetUserday(req.user.id, new Date())
  if (await data) {
    data.startTime = date.format(new Date(), 'HH:mm')
    await updateTimesheet(data)
  } else {
    timeSheetReq.startTime = date.format(new Date(), 'HH:mm')
    savetimeSheet(timeSheetReq)
  }
  return res.send({ message: 'Checkin successfully.' })
}
