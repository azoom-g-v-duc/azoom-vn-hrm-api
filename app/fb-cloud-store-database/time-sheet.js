import { getTable } from '@configs/database'

const date = require('date-and-time')
const _ = require('lodash')

export const timeSheet = {
  id: '',
  userId: '',
  startTime: '',
  endTime: '',
  leaveTypeId: '',
  checkedDate: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
  isCorrect: false
}

export const invaildTimesheet = data => {
  return true
}

export const setTimesheetId = tmsDate => {
  return date.format(new Date(tmsDate), 'YYYYMMDD')
}

export const savetimeSheet = async (userId, timeSheetReq) => {
  timeSheetReq.id = setTimesheetId(timeSheetReq.checkedDate)
  timeSheetReq.userId = userId
  const timeSheet = await getTable(process.env.DB_TABLE_TIME_SHEET)
    .doc(userId)
    .collection(timeSheetReq.id)
    .doc(timeSheetReq.id)
    .set(timeSheetReq)
  return timeSheet
}

export const updateTimesheet = async timesheetReq => {
  const queryData = await getTable(process.env.DB_TABLE_TIME_SHEET)
    .doc(timesheetReq.userId)
    .collection(timesheetReq.id)
    .get()
  queryData.docs.map(item =>
    getTable(process.env.DB_TABLE_TIME_SHEET)
      .doc(timesheetReq.userId)
      .collection(item.id)
      .doc(item.id)
      .update(timesheetReq)
  )
  return !queryData.empty
}

const checkTimesheetdoc = async userId => {
  try {
    const timeSheetId = setTimesheetId(userId)
    const query = await getTable(process.env.DB_TABLE_TIME_SHEET).get()
    const result = query.docs.find(doc => (doc.id = timeSheetId))
    return result ? true : false
  } catch {
    return ''
  }
}

export const getTimesheetUserday = async (userId, tmsDate) => {
  if (!checkTimesheetdoc(userId)) {
    return ''
  }
  console.log(setTimesheetId(tmsDate))
  const queryData = await getTable(process.env.DB_TABLE_TIME_SHEET)
    .doc(userId)
    .collection(setTimesheetId(tmsDate))
    .get()
  return (await queryData.empty) ? '' : queryData.docs[0].data()
}
