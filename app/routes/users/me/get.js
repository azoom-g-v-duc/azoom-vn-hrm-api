import { userCollection } from '@root/database'
import _ from 'lodash/fp'

export default async (req, res) => {
  const userSnapshot = await userCollection().doc(req.user.id).get()
  if (!userSnapshot.exists || !userSnapshot.data().isActive) return res.sendStatus(404)

  return res.send(_.omit(['created', 'updated', 'password', 'isActive'], userSnapshot.data()))
}
