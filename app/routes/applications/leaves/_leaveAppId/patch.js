import { execute } from '@root/util'
import { status } from '@constants/index'
import getLeaveApp from '@routes/applications/leaves/_leaveAppId/get'
import saveLeaveApplication from '@routes/applications/leaves/put'
import checkPermissionOfManager from '@helpers/project/checkPermissionOfManager'
import getTimesheetUserDate from '@routes/timesheets/get'
import saveTimesheet from '@routes/timesheets/post'
import updateTimesheet from '@routes/timesheets/patch'
import { timesheet } from '@constants/models'
import newApprovalUser from '@helpers/users/initNewApprovalUser'
import calculateApprovalPoints from '@helpers/calculateApprovalPoints'
import getRole from '@helpers/users/getRole'

module.exports = async (req, res) => {
  const { leaveAppId } = req.params
  const { isApproved = false } = req.query
  const leaveAppResponse = await execute(getLeaveApp, {
    params: { leaveAppId },
  })
  if (leaveAppResponse.status !== 200) {
    return res.sendStatus(leaveAppResponse.status)
  }
  const existedLeaveApplication = leaveAppResponse.body
  if (existedLeaveApplication.status !== status.pending) {
    return res
      .status(400)
      .send({ message: 'This application has been already approved/rejected.' })
  }

  const role = await getRole(req.user.id)
  if (
    !(await checkPermissionOfManager(
      req.user.id,
      existedLeaveApplication.userId
    )) &&
    !['admin', 'editor'].includes(role)
  ) {
    return res.status(403).send({ message: 'Forbidden' })
  }

  const isUserEditedBefore = existedLeaveApplication.approvalUsers
    ? existedLeaveApplication.approvalUsers.find(
        (approvalUser) => approvalUser.userId === userId
      )
    : false

  if (isUserEditedBefore)
    return res.status(400).send({
      message: 'This application has been already approved/rejected.',
    })

  const approvalUser = await newApprovalUser(req.user.id, isApproved)
  if (!existedLeaveApplication.approvalUsers) {
    existedLeaveApplication.approvalUsers = [approvalUser]
  } else {
    existedLeaveApplication.approvalUsers.push(approvalUser)
  }
  
  if (!isApproved) {
    existedLeaveApplication.status = status.rejected
    await execute(saveLeaveApplication, { body: existedLeaveApplication })
    return res.send({ message: 'Rejected successfully.' })
  }

  existedLeaveApplication.approvalCosre = calculateApprovalPoints(
    data.approvalUsers
  )

  if (existedLeaveApplication.approvalCosre >= process.env.POSITION_ADMIN) {
    existedLeaveApplication.status = status.approved
    updateLeaveToTimesheet(
      existedLeaveApplication.userId,
      existedLeaveApplication.requiredDates,
      existedLeaveApplication.leaveTypeId
    )
  }
  
  await execute(saveLeaveApplication, { body: existedLeaveApplication })
  return res.send({ message: 'Approved successfully.' })
}

const updateLeaveToTimesheet = async (userId, dates, leaveTypeId) => {
  dates.forEach(async (time) => {
    const timesheetUserDateResponse = await execute(getTimesheetUserDate, {
      params: { userId, time },
    })
    if (timesheetUserDateResponse.status !== 200) {
      timesheet.userId = userId
      timesheet.checkedDate = time
      timesheet.leaveTypeId = leaveTypeId
      await execute(saveTimesheet, { body: timesheet })
    } else {
      const data = timesheetUserDateResponse.body
      data.checkedDate = time
      data.leaveTypeId = leaveTypeId
      await execute(updateTimesheet, { body: data })
    }
  })
}
