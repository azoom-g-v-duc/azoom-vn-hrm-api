import _ from 'lodash/fp'
import { userCollection } from '@root/database'
import { execute } from '@root/util.js'
import getRole from '@helpers/users/getRole.js'
import getUser from '@routes/users/_userId/get.js'

export default async (req, res) => {
  const { userId } = req.params
  const user = req.body

  const role = await getRole(req.user.positionPermissionId)
  if (!['admin', 'editor'].includes(role)) return res.sendStatus(403)

  const existUser = await execute(getUser, { params: { userId } })
  if (existUser.status === 404 || !existUser.body) return res.sendStatus(404)

  await userCollection().doc(userId).update(user)
  return res.send(user)
}
