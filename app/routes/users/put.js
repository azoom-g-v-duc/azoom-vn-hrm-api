import { userCollection } from '@root/database'

export default async (req, res) => {
  const data = req.body
  await userCollection().doc(data.id).set(data)
  res.send(data)
}
