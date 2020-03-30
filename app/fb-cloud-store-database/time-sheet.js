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

export const setTimesheetId = () => {
  return date.format(new Date(), 'YYYYMMDD')
}

export const savetimeSheet = async (user, timeSheetReq) => {
  timeSheetReq.id = setTimesheetId()
  timeSheetReq.userId = user.id
  const timeSheet = await getTable(process.env.DB_TABLE_TIME_SHEET)
    .doc(user.id)
    .collection(timeSheetReq.id)
    .doc(timeSheetReq.id)
    .set(timeSheetReq)
  return timeSheet
}

export const updateTimesheet = async (user, timesheetReq) => {
  const timeSheetId = setTimesheetId()
  const queryData = await getTable(process.env.DB_TABLE_TIME_SHEET)
    .doc(user.id)
    .collection(timeSheetId)
    .get()
  queryData.docs.map(item =>
    getTable(process.env.DB_TABLE_TIME_SHEET)
      .doc(user.id)
      .collection(item.id)
      .doc(item.id)
      .update(timesheetReq)
  )
  return !queryData.empty
}

export const getTimesheetUserday = async (userId, day) => {
  const queryData = await getTable(process.env.DB_TABLE_TIME_SHEET)
    .doc(userId)
    .collection(setTimesheetId(date.format(day, 'YYYYMMDD')))
    .get()
  return !queryData.empty ? queryData.docs.map(item => item.data()) : ''
}
