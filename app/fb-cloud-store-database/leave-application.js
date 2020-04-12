const date = require('date-and-time')
const _ = require('lodash')
const firebase = require('firebase')

const leaveApplicationCollection = () => {
  return firebase.firestore().collection(process.env.DB_TABLE_LEAVE_APPLICATION)
}

export const leaveApplication = {
  id: '',
  userId: '',
  approvalUserId: '',
  approvalCosre: 0,
  requiredDates: [],
  requiredContent: '',
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

export const saveLeaveApplication = async data => {
  data.id = setId(data.userId)
  const leaveApp = await leaveApplicationCollection()
    .doc(data.id)
    .set(data)
  return leaveApp
}

export const getAllLeaveApp = async (page, number) => {
  const result = { count: 0, data: [] }
  const query = await leaveApplicationCollection().orderBy('created', 'desc')
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

export const getAllLeaveAppOfUserList = async (page, number, userList) => {
  const result = { count: 0, data: [] }
  const query = await leaveApplicationCollection()
    .where('userId', 'in', userList)
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

export const updateLeaveApp = async dataReq => {
  const queryData = await leaveApplicationCollection()
    .where('id', '==', dataReq.id)
    .get()
  queryData.docs.map(item =>
    leaveApplicationCollection()
      .doc(item.id)
      .update(_.defaultsDeep(dataReq, item.data()))
  )

  return queryData.empty ? '' : queryData.docs[0].data()
}

export const getLeaveApp = async timsheetAppId => {
  const queryData = await leaveApplicationCollection()
    .where('id', '==', timsheetAppId)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}
