import _ from 'lodash/fp'
import { userCollection } from '@root/database'
import { execute } from '@root/util.js'
import getRole from '@helpers/users/getRole.js'
import getUser from '@routes/users/_userId/get.js'

export default async (req, res) => {
  const { userId } = req.params
  const { user } = req.body
  const userUpdateId = req.body.userId

  const role = await getRole(userUpdateId)
  if (role !== 'admin' && role !== 'editor') return res.sendStatus(403)

  const existUser = await execute(getUser, { params: { userId } })
  // TODO: Đợi Tuấn Anh fix hàm execute rồi sửa tiếp
  if (typeof existUser !== 'object') return res.sendStatus(404)

  await userCollection().doc(userId).update(user)
  return res.send(user)
}
