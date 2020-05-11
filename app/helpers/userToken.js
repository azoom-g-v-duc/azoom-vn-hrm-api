import { defaultsDeep } from 'lodash/fp'
import { format } from 'date-fns/fp'
import firebase from 'firebase'

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
  const data = defaultsDeep(
    userToken,
    { id: id, userId: userId, tokenCode: tokenCode }
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
        updated: format('yyyy/MM/dd HH:mm:ss', new Date())

      })
  )
  return queryData.empty
    ? ''
    : queryData.docs.map(item =>
      userTokenCollection()
        .doc(item.id)
        .update({
          isActive: false,
          updated: format('yyyy/MM/dd HH:mm:ss', new Date())
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
