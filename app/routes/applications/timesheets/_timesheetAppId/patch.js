import { execute } from '@root/util.js'
import { timesheetApplicationCollection } from '@root/database'
import { status } from '@constants/index'
import getExistTimesheetApp from '@routes/applications/timesheets/_timesheetAppId/get.js'
import checkPermissionOfManager from '@helpers/project/checkPermissionOfManager'
import initNewApprovalUser from '@helpers/users/initNewApprovalUser'
import calculateApprovalPoints from '@helpers/calculateApprovalPoints'
import getRole from '@helpers/users/getRole'
import firebase from 'firebase'

export default async function(req, res) {
  const { timesheetAppId } = req.params
  const userId = req.user.id
  const { isApproved = 0 } = req.query
  const responseTimesheet = await execute(getExistTimesheetApp, { params: { timesheetAppId } } )

  if (responseTimesheet.status === 404 || !responseTimesheet.body) return res.sendStatus(404)
  const exitTimesheetApp = responseTimesheet.body
  if (exitTimesheetApp.status !== status.inPending) {
    return res.status(400).send({ message: 'This Application has been already approved/rejected.' })
  }

  const isUserEditedBefore = exitTimesheetApp.approvalUsers.find(approvalUser => approvalUser.userId === userId)
  if (isUserEditedBefore) return res.status(400).send( { message: "You have already approved/rejected this application." } )

  const role = await getRole(userId)
  const permissionToEdit = await checkPermissionOfManager(userId, exitTimesheetApp.userId)
  if (!permissionToEdit && !['admin', 'editor'].includes(role)) return res.sendStatus(403)

  const newApprovalUser = await initNewApprovalUser(userId, isApproved)
  const totalApprovalPoints = calculateApprovalPoints([...exitTimesheetApp.approvalUsers, newApprovalUser])
  const updateTimesheetApp = {
    updated: new Date(),
    approvalUsers: firebase.firestore.FieldValue.arrayUnion(newApprovalUser)
  }
  if (!isApproved) {
    await saveTimesheetApp(timesheetAppId, { ...updateTimesheetApp, status: status.reject })
    return res.send( { message: "Rejected successfully." } )
  } else if (totalApprovalPoints >= process.env.POSITION_ADMIN) {
    await saveTimesheetApp(timesheetAppId, { ...updateTimesheetApp, status: status.approved })
    return res.send( { message: "Approved successfully." } )
  } else {
    await saveTimesheetApp(timesheetAppId, updateTimesheetApp)
    return res.send( { message: "Approved successfully." } )
  }
}

const saveTimesheetApp = async function(timesheetAppId, timesheetApp) {
  return timesheetApplicationCollection().doc(timesheetAppId).update(timesheetApp)
}
