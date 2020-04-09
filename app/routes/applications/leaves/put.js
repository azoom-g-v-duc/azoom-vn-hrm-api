const { getLeaveApplicationCollection } = require('@root/database')
const date = require('date-and-time')
module.exports = async (req, res) => {
  const leaveApplication = req.body
  await getLeaveApplicationCollection().doc(leaveApplication.id).set(leaveApplication)
  res.send(leaveApplication)
}


