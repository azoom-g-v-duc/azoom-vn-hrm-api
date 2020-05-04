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
  const getLeaveAppResponse = await execute(getLeaveApp, {
    params: { leaveAppId },
  })
  if (getLeaveAppResponse.status !== 200) {
    return res.sendStatus(getLeaveAppResponse.status)
  }
  const existedLeaveApplication = getLeaveAppResponse.body
  if (existedLeaveApplication.status !== status.pending) {
    return res
      .status(400)
      .send({ message: 'This Application has been already approved/rejected.' })
  }
  const role = await getRole(req.user.id)

  if (
    (await checkPermissionOfManager(
      req.user.id,
      existedLeaveApplication.userId
    )) ||
    role === 'admin' ||
    role === 'editor'
  ) {
    const isUserEditedBefore = existedLeaveApplication.approvalUsers.find(
      (approvalUser) => approvalUser.userId === userId
    )
    if (isUserEditedBefore)
      return res.status(400).send({
        message: 'This Application has been already approved/rejected.',
      })

    const approvalUser = newApprovalUser(req.user.id, isApproved)
    existedLeaveApplication.approvalUsers.push(approvalUser)

    if (!isApproved) {
      existedLeaveApplication.status = status.rejected
      await execute(saveLeaveApplication, { body: existedLeaveApplication })
      return res.send({ message: 'Successfully.' })
    }

    existedLeaveApplication.approvalCosre = calculateApprovalPoints(
      data.approvalUsers
    )

    if (existedLeaveApplication.approvalCosre >= process.env.POSITION_ADMIN) {
      existedLeaveApplication.status = status.approved
      updateLeaveToTimesheet(
        existedLeaveApplication.userId,
        existedLeaveApplication.requiredDates
      )
    }
    await execute(saveLeaveApplication, { body: existedLeaveApplication })
    return res.send({ message: 'Successfully.' })
  }
  return res.sendStatus(403)
}

const updateLeaveToTimesheet = async (userId, dateList) => {
  dateList.forEach(async (element) => {
    const data = await execute(getTimesheetUserDate, {
      params: { userId, time: element.date },
    })
    if (!data) {
      timesheet.userId = userId
      timesheet.checkedDate = element.date
      timesheet.leaveTypeId = element.leaveType
      await execute(saveTimesheet, { body: timesheet })
    }
    data.checkedDate = element.date
    data.leaveTypeId = element.leaveType
    await execute(updateTimesheet, { body: data })
  })
}
