import getUser from '@routes/users/_userId/get.js'
import { execute } from '@root/util.js'

export default async function (userId, isApproved) {
  const userResponse = await execute(getUser, { params: { userId } })
  if (userResponse.status !== 200) return 
  const user = userResponse.body
  const approvalPoint = isApproved ? user.positionPermissionId : 0
  return {
    userId: user.body.id,
    name: user.body.fullName,
    createdDate: new Date(),
    approvalPoint,
  }
}
