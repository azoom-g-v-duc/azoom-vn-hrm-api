import { generateToken } from '@helpers/jwt-helper'

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
    { id: id, userId: userId, tokenCode: tokenCode },
    userToken
  )
  const tokenUser = await tokenUserCollection()
    .doc(id)
    .set(data)
  return tokenUser
}

const getUserByEmailAndPassword = async (email, password) => {
  const queryData = await userCollection()
    .where('email', '==', email)
    .get()
  const userDoc = queryData.docs.find(doc =>
    bcrypt.compare(password, doc.data().password)
  )
  return userDoc ? userDoc.data() : ''
}
