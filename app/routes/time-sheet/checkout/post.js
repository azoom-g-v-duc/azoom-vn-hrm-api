import {
  updateTimesheet,
  saveTimesheet,
  getTimesheetUserdate,
  timesheet
} from '@cloudStoreDatabase/time-sheet'
const date = require('date-and-time')

module.exports = async (req, res) => {
  const result = await getTimesheetUserdate(req.user.id, new Date())
  if (await result) {
    result.endTime = date.format(new Date(), 'HH:mm')
    await updateTimesheet(result)
  } else {
    timesheet.userId = req.user.id
    timesheet.checkedDate = new Date()
    timesheet.endTime = date.format(new Date(), 'HH:mm')
    saveTimesheet(timesheet)
  }
  return res.send({ message: 'Checkin successfully.' })
}
