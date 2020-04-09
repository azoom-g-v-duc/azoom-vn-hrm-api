import getUser from '@routes/users/_userId/get.js'
import { execute } from '@root/util.js'

export const newApprovalUser = async (userId, isApproved) => {
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

export const calculateApprovalPoints = (approvalUsers) => {
  return approvalUsers.reduce((points, user) => {
    return points + user.approvalPoint
  }, 0)
}
