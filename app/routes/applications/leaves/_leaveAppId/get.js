import { leaveApplicationCollection } from '@root/database'

export default async (req, res) => {
  try {
    const { leaveAppId } = req.params

    const existedLeaveApplication = await leaveApplicationCollection().doc(leaveAppId).get()
    if (existedLeaveApplication.exists) {
      res.send(existedLeaveApplication.data())
    } else {
      res.sendStatus(404)
    }
  } catch {
    res.sendStatus(500)
  }
}
