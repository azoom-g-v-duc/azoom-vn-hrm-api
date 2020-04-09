const date = require('date-and-time')
const _ = require('lodash')

const firebase = require('firebase')

import { userTokenCollection } from '@root/database'

export const userToken = {
  id: '',
  userId: '',
  tokenCode: '',
  isActive: true,
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  updated: ''
}

export const saveToken = async (userId, tokenCode) => {
  const id = userId + Date.now()
  const data = _.defaultsDeep(
    { id: id, userId: userId, tokenCode: tokenCode },
    userToken
  )
  const tokenUser = await userTokenCollection()
    .doc(id)
    .set(data)
  return tokenUser
}

export const getToken = async (userId, tokenFromClient) => {
  const queryData = await userTokenCollection()
    .where('tokenCode', '==', tokenFromClient)
    .where('userId', '==', userId)
    .where('isActive', '==', true)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}

export const destroyALLTokenOfUser = async userId => {
  const queryData = await userTokenCollection()
    .where('userId', '==', userId)
    .get()
  queryData.docs.map(item =>
    userTokenCollection()
      .doc(item.id)
      .update({
        isActive: false,
        updated: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
      })
  )
  return queryData.empty
    ? ''
    : queryData.docs.map(item =>
      userTokenCollection()
          .doc(item.id)
          .update({
            isActive: false,
            updated: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
          })
      )
}

export const destroyToken = async tokenFromClient => {
  const queryData = await userTokenCollection()
    .where('tokenCode', '==', tokenFromClient)
    .get()
  return queryData.empty
    ? ''
    : queryData.docs.map(item =>
      userTokenCollection()
          .doc(item.id)
          .update({
            isActive: false
          })
      )
}
