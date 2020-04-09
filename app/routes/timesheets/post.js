import { timesheetCollection } from '@root/database'
import initTimesheetId from '@helpers/timesheets/initTimesheetId'

export default async (req, res) => {
  try {
    const timesheet = req.body
    const timesheetId = initTimesheetId(timesheet.userId, new Date())
    const saveTimesheet = { ...timesheet, id: timesheetId }

    await timesheetCollection().doc(saveTimesheet.id).set(saveTimesheet)
    res.send(saveTimesheet)
  } catch (error) {
    res.status(500).send({ message: 'Error when save timesheet to firebase.' })
  }
}
