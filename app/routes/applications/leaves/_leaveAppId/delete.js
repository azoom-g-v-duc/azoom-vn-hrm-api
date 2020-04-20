import { leaveApplicationCollection } from '@root/database.js'
import { status } from '@constants'
import getRole from '@helpers/users/getRole'

export default async (req, res) => {
  try {
    const { leaveAppId } = req.params
    const leaveApplicationSnapshot = await leaveApplicationCollection().doc(leaveAppId).get()
    const { id, userId, status, isActive = false, approvalUsers = [] } = leaveApplicationSnapshot.exists
      ? leaveApplicationSnapshot.data()
      : {}
    if (!isActive) res.sendStatus(404)

    const role = await getRole(req.user.id)
    if (
      status === status.inPending &&
      approvalUsers.length === 0 &&
      (role === 'admin' || role === 'editor' || userId === req.user.id)
    ) {
      await leaveApplicationCollection().doc(id).update({ isActive: false })
      return res.send({ message: 'Successfully.' })
    }
    return res.sendStatus(403)
  } catch {
    res.sendStatus(500)
  }
}
