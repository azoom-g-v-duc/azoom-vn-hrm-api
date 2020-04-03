import {
  updateTimesheet,
  savetimeSheet,
  getTimesheetUserday,
  timeSheet
} from '@cloudStoreDatabase/time-sheet'
const date = require('date-and-time')

module.exports = async (req, res) => {
  const timeSheetReq = await getTimesheetUserday(req.user.id, new Date())
  console.log(await timeSheetReq)

  if (await timeSheetReq) {
    timeSheetReq.endTime = date.format(new Date(), 'HH:mm')
    await updateTimesheet(timeSheetReq)
  } else {
    timeSheet.checkedDate = new Date()
    timeSheet.endTime = date.format(new Date(), 'HH:mm')
    savetimeSheet(req.user.id, timeSheet)
  }
  return res.send({ message: 'Checkin successfully.' })
}
