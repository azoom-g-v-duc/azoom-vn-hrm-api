import { execute } from '@root/util.js'
import { applicationStatus } from '@root/constants.js'
import { timesheetApplicationCollection } from '@root/database'
import getExistTimesheetApp from '@routes/applications/timesheets/_timesheetAppId/get.js'
import getRole from '@helpers/users/getRole'

export default async (req, res) => {
  const userId = req.user.id
  const { timesheetAppId } = req.params
  const role = await getRole(req.user.positionPermissionId)
  const responseTimesheetApp = await execute(getExistTimesheetApp, { params: { timesheetAppId } } )
  const exitTimesheetApp = responseTimesheetApp.body

  if (responseTimesheetApp.status === 404 || !responseTimesheetApp.body ) return res.sendStatus(404)
  if (exitTimesheetApp.status !== applicationStatus.inPending || exitTimesheetApp.approvalUsers.length !== 0) {
    return res.status(400).send({ message: 'You cannot delete the application which was approved/rejected.' })
  }
  if (role !== 'admin' && exitTimesheetApp.userId !== userId) return res.sendStatus(403)

  await timesheetApplicationCollection().doc(timesheetAppId).update({ isActive: 0 })
  return res.send({ message: `Timesheet application ${timesheetAppId} was deleted` })
}
