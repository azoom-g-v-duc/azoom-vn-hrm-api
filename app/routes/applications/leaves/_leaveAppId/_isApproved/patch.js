import {
  updateLeaveApp,
  getLeaveApp
} from '@cloudStoreDatabase/leave-application'
import {
  updateTimesheet,
  getTimesheetUserdate,
  saveTimesheet,
  timesheet
} from '@cloudStoreDatabase/timesheet'
import { isAdmin, isEditor } from '@helpers/check-rule'
import {
  getMemberOfProjectList,
  getProjectListOfManagerId
} from '@cloudStoreDatabase/project-member'
const { status } = '@constants/index'

module.exports = async (req, res) => {
  const { leaveAppId, isApproved = false } = req.params
  const data = await getLeaveApp(leaveAppId)
  if (!data) {
    return res.sendStatus(404)
  }
  if (
    (await checkPermissionOfManage(req.user.id, data.userId)) ||
    isAdmin(req.user.positionPermissionId) ||
    isEditor(req.user.positionPermissionId)
  ) {
    if (!isApproved) {
      data.status = status.reject
      updateLeaveApp(data)
      return res.send({ message: 'Successfully.' })
    }
    if (data.status == status.inPending) {
      data.approvalCosre += req.user.positionPermissionId
      if (data.approvalCosre == process.env.POSITION_ADMIN) {
        data.status = status.approved
        updateLeaveToTimesheet(data.userId, data.requiredDates)
      }
      updateLeaveApp(data)
      return res.send({ message: 'Successfully.' })
    }
  }
  return res.sendStatus(403)
}

const checkPermissionOfManage = async (managerId, memberId) => {
  const projectlist = await getProjectListOfManagerId(managerId)
  const memberList = await getMemberOfProjectList(
    projectlist.map(item => item.id)
  )
  if (memberList.find(item => (item.memberId = memberId))) {
    return true
  }
  return false
}

const updateLeaveToTimesheet = async (userId, dateList) => {
  dateList.forEach(async element => {
    const data = await getTimesheetUserdate(userId, element.date)
    if (!(await data)) {
      timesheet.userId = userId
      timesheet.checkedDate = element.date
      timesheet.leaveTypeId = element.leaveType
      saveTimesheet(timesheet)
    }
    data.checkedDate = element.date
    data.leaveTypeId = element.leaveType
    updateTimesheet(data)
  })
}
