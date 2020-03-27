const date = require('date-and-time')
import { getTable } from '@configs/database'

import { checkIdUserExist } from '@cloudStoreDatabase/user'

export const timesheetApplication = {
  id: '',
  userId: '',
  approvalUserId: '',
  startTime: '',
  endTime: '',
  requiredDate: '',
  timesheetId: '',
  requiredContent: '',
  isRject:false,
  isApproved: false,
  isActive: true,
  created: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
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
  const users = await getTable(process.env.DB_TABLE_TIME_SHEET_APPLICATION)
    .doc(data.id)
    .set(data)
  return users
}

export const getAllTsA = async (page, number) => {
  const result = { count: 0, data: [] }
  const query = await getTable(
    process.env.DB_TABLE_TIME_SHEET_APPLICATION
  ).orderBy('created', 'desc')
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
      ? ''
      : await queryData.docs.map(doc => doc.data())
    return result
  }

  return result
}

export const getAllTsAProjectlist = async (page, number, projectIdlist) => {
  const result = { count: 0, data: [] }
  const query = await getTable(process.env.DB_TABLE_TIME_SHEET_APPLICATION)
    .where('projectId', 'in', projectIdlist)
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
      ? ''
      : await queryData.docs.map(doc => doc.data())
    return result
  }

  return result
}
