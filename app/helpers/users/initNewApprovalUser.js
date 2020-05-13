export default async function (user, isApproved) {
  const approvalPoint = isApproved ? user.positionPermissionId : 0
  return {
    userId: user.id,
    name: user.fullName,
    createdDate: new Date(),
    approvalPoint,
  }
}
