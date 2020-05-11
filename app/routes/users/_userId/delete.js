import { userCollection } from '@root/database'
import { execute } from '@root/util.js'
import getRole from '@helpers/users/getRole.js'
import getUser from '@routes/users/_userId/get.js'

export default async (req, res) => {
  const { userId } = req.params

  const role = await getRole(req.user.positionPermissionId)
  if (role !== 'admin') return res.sendStatus(403)

  const existUser = await execute(getUser, { params: { userId } })
  if (existUser.status === 404 || !existUser.body) return res.sendStatus(404)

  await userCollection().doc(userId).update({ isActive: 0 })
  return res.sendStatus(200)
}
