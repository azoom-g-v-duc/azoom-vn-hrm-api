const date = require('date-and-time')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const firebase = require('firebase')

const userCollection = () => {
  return firebase.firestore().collection(process.env.DB_TABLE_USER)
}

export const user = {
  id: '',
  userName: '',
  fullName: '',
  email: '',
  password: '',
  birthDate: '',
  address: '',
  tel: '',
  zipCode: '',
  totalPaidLeaveDate: 0,
  contractType: 0,
  position: 'Dev',
  positionPermissionId: 1,
  isActive: true,
  created: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
  updated: ''
}

const checkEmailExist = async useremail => {
  const queryData = await userCollection()
    .where('email', '==', useremail)
    .get()
  return !queryData.empty
}

export const checkIdUserExist = async userId => {
  const queryData = await userCollection()
    .where('id', '==', userId)
    .get()
  return !queryData.empty
}

export const isValidUser = async (id, email) => {
  if ((await checkEmailExist(email)) || (await checkIdUserExist(id))) {
    return false
  }
  return true
}

export const saveUser = async data => {
  data.password = bcrypt.hashSync(data.password, 10)
  const users = await userCollection()
    .doc(data.id)
    .set(data)
  return users
}

export const updateUser = async (userId, dataReq) => {
  const queryData = await userCollection()
    .where('id', '==', userId)
    .get()
  queryData.docs.map(item =>
    getTable(process.env.DB_TABLE_USER)
      .doc(item.id)
      .update(dataReq)
  )
  return queryData.empty ? false : true
}

export const getAllUser = async (page, number) => {
  const result = { count: 0, data: [] }
  const query = await userCollection().orderBy('created', 'desc')
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

export const getUserId = async userId => {
  const queryData = await userCollection()
    .where('id', '==', userId)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}

export const getUser = async (email, password) => {
  const queryData = await userCollection()
    .where('email', '==', email)
    .get()
  const userDoc = queryData.docs.find(doc =>
    bcrypt.compare(password, doc.data().password)
  )
  return userDoc ? userDoc.data() : ''
}
