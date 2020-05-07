import bcrypt from 'bcrypt'
import firebase from 'firebase'
import _ from 'lodash/fp'
import { generateToken } from '@helpers/jwt-helper'
import { userCollection, userTokenCollection } from '@root/database'

const userToken = {
  id: '',
  userId: '',
  tokenCode: '',
  isActive: true,
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  updated: ''
}

export default async function (req, res) {
  try {
    const { email, password } = req.body
    const user = await getUserByEmailAndPassword(email, password)

    if (user) {
      const accessToken = await generateToken(
        user,
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_LIFE
      )
      await saveToken(user.id, accessToken)
      return res.send({ accessToken: accessToken })
    }
    return res.sendStatus(400)
  } catch (error) {
    return res.sendStatus(500)
  }
}

const saveToken = async (userId, tokenCode) => {
  const id = userId + Date.now()
  const data = _.defaultsDeep(
    userToken,
    { id: id, userId: userId, tokenCode: tokenCode }
  )
  const tokenUser = await userTokenCollection()
    .doc(id)
    .set(data)
  return tokenUser
}

const getUserByEmailAndPassword = async (email, password) => {
  const queryData = await userCollection()
    .where('email', '==', email)
    .where('isActive', '==' , true)
    .get()
  const userDoc = queryData.docs.find(doc =>
    bcrypt.compareSync(password, doc.data().password)
  )
  return userDoc ? userDoc.data() : ''
}
