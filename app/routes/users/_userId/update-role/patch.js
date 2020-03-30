import { updateUser, getUserId } from '@cloudStoreDatabase/user'
import { isAdmin } from '@helpers/check-rule'

module.exports = async (req, res) => {
  const { userId } = req.params
  if (!isAdmin(req.user.possitionPermissionId)) {
    return res.sendStatus(403)
  }
  const { possitionPermissionId = 4 } = req.body

  return (await updateUser(userId, {
    possitionPermissionId: possitionPermissionId
  }))
    ? res.send(await getUserId(userId))
    : res.sendStatus(400)
}
