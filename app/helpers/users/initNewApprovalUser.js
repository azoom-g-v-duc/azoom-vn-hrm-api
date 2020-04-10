import getUser from '@routes/users/_userId/get.js'
import { execute } from '@root/util.js'

export default async (userId, isApproved) => {
  const user = await execute(getUser, { params: { userId } })
  if (!user) return

  const approvalPoint = isApproved ? user.positionPermissionId : 0

  return {
    userId: user.id,
    name: user.fullName,
    createdDate: new Date(),
    approvalPoint,
  }
}

