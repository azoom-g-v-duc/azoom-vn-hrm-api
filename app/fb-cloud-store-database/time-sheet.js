import { getTable } from '@configs/database'

const date = require('date-and-time')
const _ = require('lodash')

export const timeSheet = {
  id: '',
  userId: '',
  startTime: '',
  endTime: '',
  checkeddate: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
  isCorrect: false
}

export const invaildTimesheet = () => {}

export const setTimesheetId = timesheetId => {
  return timesheetId + date.format(new Date(), 'YYYYMMDD')
}

export const savetimeSheet = async (user, timeSheetReq) => {
  timeSheetReq.id = setTimesheetId(user.id)
  timeSheetReq.userId = user.id
  const timeSheet = await getTable(process.env.DB_TABLE_TIME_SHEET)
    .doc(user.id)
    .collection(timeSheetReq.id)
    .doc(timeSheetReq.id)
    .set(timeSheetReq)
  return timeSheet
}

export const checkoutTimesheet = async (user, timeSheetReq) => {
  const timeSheetId = setTimesheetId(user.id)
  if (!(await checkTimesheetdoc(user.id))) {
    timeSheetReq.startTime = ''
    return savetimeSheet(user, timeSheetReq)
  }
  const queryData = await getTable(process.env.DB_TABLE_TIME_SHEET)
    .doc(user.id)
    .collection(timeSheetId)
    .where('isCorrect', '==', false)
    .where('startTime', '==', '')
    .get()
  queryData.docs.map(item =>
    getTable(process.env.DB_TABLE_TIME_SHEET)
      .doc(user.id)
      .collection(item.id)
      .doc(item.id)
      .update({ endTime: timeSheetReq.endTime })
  )
  if (queryData.empty) {
    savetimeSheet(user, timeSheetReq)
  }
  return !queryData.empty
}

export const checkTimesheetdoc = async userId => {
  const timeSheetId = setTimesheetId(userId)
  const query = await getTable(process.env.DB_TABLE_TIME_SHEET).get()
  const result = query.docs.find(doc => (doc.id = timeSheetId))
  return result ? true : false
}
