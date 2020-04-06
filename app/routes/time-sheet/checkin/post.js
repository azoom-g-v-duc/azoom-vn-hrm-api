import {
  updateTimesheet,
  saveTimesheet,
  getTimesheetUserdate,
  timesheet as timesheetReq
} from '@cloudStoreDatabase/time-sheet'
const date = require('date-and-time')

module.exports = async (req, res) => {
  const data = await getTimesheetUserdate(req.user.id, new Date())
  if (await data) {
    data.startTime = date.format(new Date(), 'HH:mm')
    updateTimesheet(data)
  } else {
    timesheetReq.userId = req.user.id
    timesheetReq.checkedDate = new Date()
    timesheetReq.startTime = date.format(new Date(), 'HH:mm')
    saveTimesheet(timesheetReq)
  }
  return res.send({ message: 'Checkin successfully.' })
}
