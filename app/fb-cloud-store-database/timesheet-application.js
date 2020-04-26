const date = require('date-and-time')
const _ = require('lodash')
const firebase = require('firebase')

const timesheetAppCollection = () => {
  return firebase
    .firestore()
    .collection(process.env.DB_TABLE_TIME_SHEET_APPLICATION)
}

export const timesheetApplication = {
  id: '',
  userId: '',
  approvalUserId: [],
  startTime: '',
  endTime: '',
  requiredDate: '',
  timesheetId: '',
  requiredContent: '',
  approvalCosre: 0,
  status: -1,
  isActive: true,
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  updated: ''
}

export const isValidTsA = async data => {
  return true
}
const setId = id => {
  return id + date.format(new Date(), 'YYYYMMDDHHMMSS')
}

export const saveTimesheetApplication = async data => {
  data.id = setId(data.userId)
  const users = await timesheetAppCollection()
    .doc(data.id)
    .set(data)
  return users
}

export const getAllTsApp = async (page, number) => {
  const result = { count: 0, data: [] }
  const query = await timesheetAppCollection().orderBy('created', 'desc')
  const datall = await query.get()
  result.count = datall.empty ? 0 : await datall.docs.length
  if (!page) {
    result.data = datall.empty ? '' : await datall.docs.map(doc => doc.data())
    return result
  }
  if (page && number && page * number - 1 <= result.count) {
    const queryData = await query
      .startAt(
        await datall.docs[page - 1 ? (page - 1) * number : page - 1].data()
          .created
      )
      .limit(number)
      .get()
    result.data = queryData.empty
      ? []
      : await queryData.docs.map(doc => doc.data())
    return result
  }

  return result
}

export const getAllTsAppUserList = async (page, number, userIdList) => {
  const result = { count: 0, data: [] }
  const query = timesheetAppCollection()
    .where('userId', 'in', userIdList)
    .orderBy('created', 'desc')
  const datall = await query.get()
  result.count = datall.empty ? 0 : await datall.docs.length
  if (!page) {
    result.data = datall.empty ? '' : await datall.docs.map(doc => doc.data())
    return result
  }
  if (page && number && page * number - 1 <= result.count) {
    const queryData = await query
      .startAt(
        await datall.docs[page - 1 ? (page - 1) * number : page - 1].data()
          .created
      )
      .limit(number)
      .get()
    result.data = queryData.empty
      ? []
      : await queryData.docs.map(doc => doc.data())
    return result
  }

  return result
}

export const getAllTsAppUser = async (page, number, userId) => {
  const result = { count: 0, data: [] }
  const query = await timesheetAppCollection()
    .where('userId', '==', userId)
    .orderBy('created', 'desc')
  const datall = await query.get()
  result.count = datall.empty ? 0 : await datall.docs.length
  if (!page) {
    result.data = datall.empty ? '' : await datall.docs.map(doc => doc.data())
    return result
  }
  if (page && number && page * number - 1 <= result.count) {
    const queryData = await query
      .startAt(
        await datall.docs[page - 1 ? (page - 1) * number : page - 1].data()
          .created
      )
      .limit(number)
      .get()
    result.data = queryData.empty
      ? []
      : await queryData.docs.map(doc => doc.data())
    return result
  }

  return result
}

export const updateTsApp = async dataReq => {
  const queryData = await timesheetAppCollection()
    .where('id', '==', dataReq.id)
    .get()
  queryData.docs.map(item =>
    getTable(process.env.DB_TABLE_TIME_SHEET_APPLICATION)
      .doc(item.id)
      .update(_.defaultsDeep(dataReq, item.data()))
  )
  return queryData.empty ? '' : queryData.docs[0].data()
}

export const getTsApp = async timsheetAppId => {
  const queryData = await timesheetAppCollection()
    .where('id', '==', timsheetAppId)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}

export const getTsApp = async timsheetAppId => {
  const queryData = await timesheetAppCollection()
    .where('id', '==', timsheetAppId)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}
