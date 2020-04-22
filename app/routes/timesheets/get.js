import { timesheetCollection } from '@root/database'
import { endOfDay, format, parse, startOfMonth, lastDayOfMonth } from 'date-fns/fp'

export default async (req, res) => {
  try {
    const { userIds = '', time, startDate, endDate } = req.query

    let query = timesheetCollection()
    if (userIds.length) {
      const ids = userIds.split(/,/)
      query = query.where('userId', 'in', ids)
    }
    if (time) {
      query = query.where('checkedDate', '>=', parse(new Date(), 'yyyy-MM-dd'), time)
    } else if (startDate || endDate) {
      if (startDate) {
        query = query.where('checkedDate', '>=', parse(new Date(), 'yyyy-MM-dd', startDate))
      }
      if (endDate) {
        const end = endOfDay(parse(new Date(), 'yyyy-MM-dd', endDate))
        query = query.where('checkedDate', '<=', end)
      }
    } else {
      query = query
        .where('checkedDate', '>=', startOfMonth(new Date()))
        .where('checkedDate', '<=', lastDayOfMonth(new Date()))
    }
    const results = await query.get()

    res.send(
      results.docs
        .map((doc) => doc.data())
        .reduce((docs, doc) => {
          const checkedDate = doc.checkedDate.toDate()
          doc.checkedDate = format('yyyy-MM-dd', checkedDate)
          return [...docs, doc]
        }, [])
    )
  } catch {
    res.status(500).send({ message: 'Error when get timesheets from firebase.' })
  }
}
