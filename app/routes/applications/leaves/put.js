const { leaveApplicationCollection } = require('@root/database')
export default async (req, res) => {
  const leaveApplication = req.body
  await leaveApplicationCollection().doc(leaveApplication.id).set(leaveApplication)
  res.send(leaveApplication)
}


