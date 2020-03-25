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
