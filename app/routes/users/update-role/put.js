import { updateUser } from '@cloudStoreDatabase/user'
import { isAdmin } from '@helpers/check-rule'

module.exports = async (req, res) => {
  if (!isAdmin(req.user.possitionPermissionId)) {
    return res.sendStatus(403)
  }
  const { possitionPermissionId = 0, userId = '' } = req.body
  const result = await updateUser(userId, {
    possitionPermissionId: possitionPermissionId
  })
  if (result) {
    return res.send(await result)
  }
  return res.sendStatus(400)
}
