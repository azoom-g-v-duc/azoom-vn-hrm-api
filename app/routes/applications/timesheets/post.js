import { timesheetApplicationCollection } from '@root/database'
import { format } from 'date-fns/fp'
import { timesheetAppIdPrefix } from '@root/constants.js'

export default async (req, res) => {
  const userId = req.user.id
  const newTimesheetApp = req.body
  const defaultTimesheetApp = {
    id: timesheetAppIdPrefix + '_' + format('yyyyMMdd-HHmmss', new Date()),
    userId,
    approvalUsers: [],
    startTime: '',
    endTime: '',
    requiredDates: '',
    timesheetId: userId + '_' + format('yyyyMMdd', new Date(newTimesheetApp.requiredDates)),
    requiredContent: '',
    status: -1,
    isActive: 1,
    created: new Date(),
    updated: '',
  }
  const saveTimesheetApp = { ...defaultTimesheetApp,  ...newTimesheetApp }
  
  await timesheetApplicationCollection().doc(saveTimesheetApp.id).set(saveTimesheetApp)
  return res.send(saveTimesheetApp)
}
