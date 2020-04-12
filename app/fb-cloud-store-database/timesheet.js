const date = require('date-and-time')
const _ = require('lodash')
const firebase = require('firebase')

const timesheetCollection = () => {
  return firebase.firestore().collection(process.env.DB_TABLE_TIME_SHEET)
}

export const timesheet = {
  id: '',
  userId: '',
  startTime: '',
  endTime: '',
  leaveTypeId: '',
  checkedDate: date.format(new Date(), 'YYYY/MM/DD'),
  isCorrect: false
}

export const invaildTimesheet = data => {
  return true
}

export const setTimesheetId = tmsDate => {
  return date.format(new Date(tmsDate), 'YYYYMMDD')
}

export const saveTimesheet = async timesheetReq => {
  timesheetReq.id = setTimesheetId(timesheetReq.checkedDate)
  await timesheetCollection()
    .doc(timesheetReq.userId)
    .collection(timesheetReq.id)
    .doc(timesheetReq.id)
    .set(timesheetReq)
  return timesheetReq
}

export const updateTimesheet = async timesheetReq => {
  await timesheetCollection()
    .doc(timesheetReq.userId)
    .collection(timesheetReq.id)
    .doc(timesheetReq.id)
    .update(timesheetReq)
  return timesheetReq
}

const checkTimesheetdoc = async userId => {
  try {
    const query = await timesheetCollection().get()
    return query.docs.find(doc => (doc.id = setTimesheetId(userId)))
      ? true
      : false
  } catch {
    return ''
  }
}

export const getTimesheetUserdate = async (userId, tmsDate) => {
  if (!checkTimesheetdoc(userId)) {
    return ''
  }
  const queryData = await timesheetCollection()
    .doc(userId)
    .collection(setTimesheetId(tmsDate))
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}
