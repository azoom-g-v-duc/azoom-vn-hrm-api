import { userCollection } from '@root/database'

export default async (req, res) => {
  const { email } = req.params
  const queryData = await userCollection().where('email', '==', email).get()
  const user = queryData.empty ? '' : queryData.docs[0].data()
  if (!user) {
    return res.sendStatus(404)
  }
  return res.send(user)
}
