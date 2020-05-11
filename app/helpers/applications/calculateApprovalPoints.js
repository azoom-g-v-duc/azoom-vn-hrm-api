export default (approvalUsers) => {
  return approvalUsers.reduce((points, user) => {
    return points + user.approvalPoint
  }, 0)
}
