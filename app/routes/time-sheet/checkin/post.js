import {
  updateTimesheet,
  saveTimesheet,
  getTimesheetUserday,
  timesheet as timesheetReq
} from '@cloudStoreDatabase/time-sheet'
const date = require('date-and-time')

module.exports = async (req, res) => {
  const data = await getTimesheetUserday(req.user.id, new Date())
  if (await data) {
    data.startTime = date.format(new Date(), 'HH:mm')
    await updateTimesheet(data)
  } else {
    timesheetReq.startTime = date.format(new Date(), 'HH:mm')
    saveTimesheet(timesheetReq)
  }
  return res.send({ message: 'Checkin successfully.' })
}
