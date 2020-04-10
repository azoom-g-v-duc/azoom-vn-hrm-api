import _ from 'lodash/fp'
const { userCollection } = require('@root/database')

export default async (req, res) => {
  try {
    const { userId } = req.params
    const user = await userCollection().doc(userId).get()
    if (!user.exists) return res.sendStatus(404)

    return res.send(_.omit(['password'], user.data()))
  } catch (error) {
    return res.sendStatus(500)
  }
}
