import { generateToken } from '@helpers/jwt-helper'
import { saveToken } from '@cloudStoreDatabase/token-user'
import { getUser } from '@cloudStoreDatabase/user'

export default async function (req, res) {
  try {
    const { email, password } = req.body
    const user = await getUser(email, password)

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

const createToken = async(userId,emailUser,tokenCode) => {
  const id = userId+Date.now()
  const data = _.defaultsDeep({id:id, userId:userId,emailUser:emailUser,tokenCode:tokenCode},userToken)
  const tokenUser = await getTable('userToken').doc(id).set(data)

  return tokenUser
}

const checkLogin = async(email,password) => {
  const result={isHas:false, data:''}
  const tokenUser = await getTable('users').where('email', '==', email).where('password','==',password).get()
    .then(snapshot=>
    {
    if (snapshot.empty) {
        return false
      }
    snapshot.forEach(doc => {
        result.data = doc.data()
      })
    result.isHas = true
    return result
    })
  return tokenUser
}
