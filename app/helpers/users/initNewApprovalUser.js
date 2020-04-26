import getUser from '@routes/users/_userId/get.js'
import { execute } from '@root/util.js'

export default async function (userId, isApproved) {
  const user = await execute(getUser, { params: { userId } })
  if (!user) return

  const approvalPoint = isApproved
    ? {
        [process.env.POSITION_ADMIN]: 3,
        [process.env.POSITION_EDITOR]: 2,
        [process.env.POSITION_PROJECTMANAGER]: 1,
      }[user.positionPermissionId] || 0
    : 0

  return {
    userId: user.id,
    name: user.fullName,
    createdDate: new Date(),
    approvalPoint,
  }
}
