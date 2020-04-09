import { execute } from '@root/util.js'
import { timesheetApplicationCollection } from '@root/database'
import getExistTimesheetApp from '@routes/applications/timesheets/_timesheetAppId/get.js'
import checkPermissionOfManager from '@helpers/project/checkPermissionOfManager'
import { newApprovalUser } from '@helpers/users/initNewApprovalUser'
import getRole from '@helpers/users/getRole'
import firebase from 'firebase'

export default async function (req, res) {
  const { timesheetAppId } = req.params
  const { userId } = req.body
  const { isApproved = false } = req.query
  const exitTimesheetApp = await execute(getExistTimesheetApp, { params: { timesheetAppId } })

  if (!exitTimesheetApp) return res.sendStatus(404)

  const isUserEditedBefore = exitTimesheetApp.approvalUsers.find((approvalUser) => approvalUser.userId === userId)
  if (isUserEditedBefore)
    return res.status(400).send({ message: 'This Application has been already approved/rejected.' })

  const role = await getRole(userId)
  const permissionToEdit = await checkPermissionOfManager(userId, exitTimesheetApp.userId)

  if (permissionToEdit || role === 'admin' || role === 'editor') {
    const newApprovalUser = await newApprovalUser(userId, isApproved)
    const updateTimesheetApp = {
      updated: new Date(),
      approvalUsers: firebase.firestore.FieldValue.arrayUnion(newApprovalUser),
    }
    await timesheetApplicationCollection().doc(timesheetAppId).update(updateTimesheetApp)
    res.send({ message: isApproved ? 'Approved successfully.' : 'Rejected successfully.' })
  } else {
    res.sendStatus(403)
  }
}
