import { execute } from '@root/util.js'
import checkExistTimesheet from '@routes/timesheets/get.js'
import saveTimesheet from '@routes/timesheets/post.js'
import updateTimesheet from '@routes/timesheets/patch.js'
import date from 'date-and-time'

export default async (req, res) => {
  try {
    const { userId } = req.body
    const checkedInRecord = await execute(checkExistTimesheet, { params: { userId, time: new Date() } })

    if (!checkedInRecord) {
      const newTimesheet = {
        userId,
        checkedDate: new Date(),
        startTime: date.format(new Date(), 'HH:mm'),
        endTime: '',
        created: new Date(),
        updated: '',
      }

      if (await execute(saveTimesheet, { body: newTimesheet })) {
        return res.send({ message: 'Checkin successfully.' })
      }
    } else if (!checkedInRecord.startTime) {
      const updateProperties = {
        startTime: date.format(new Date(), 'HH:mm'),
        updated: new Date(),
      }

      if (await execute(updateTimesheet, { body: updateProperties, query: { timesheetAppId: checkedInRecord.id } })) {
        return res.send({ message: 'Checkin successfully.' })
      }
    } else {
      return res.send({ message: `You checked in at ${checkedInRecord.startTime}` })
    }
  } catch (error) {
    return res.status(500).send({ message: 'Server internal error.' })
  }
}
