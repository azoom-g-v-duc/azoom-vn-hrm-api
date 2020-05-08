import getUser from '@routes/users/_userId/get.js'
import { execute } from '@root/util.js'

export default async function (userId, isApproved) {
  const user = await execute(getUser, { params: { userId } })
  if (!user.body) return
  const approvalPoint = isApproved ? user.body.positionPermissionId : 0
  return {
    userId: user.body.id,
    name: user.body.fullName,
    createdDate: new Date(),
    approvalPoint,
  }
}
