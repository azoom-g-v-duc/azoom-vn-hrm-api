import {
  updateTsApp,
  getTsApp
} from '@cloudStoreDatabase/timesheet-application'
import {
  updateTimesheet,
  getTimesheetUserdate
} from '@cloudStoreDatabase/timesheet'

import { isAdmin, isEditor } from '@helpers/check-rule'
import {
  getMemberOfProjectList,
  getProjectListOfManagerId
} from '@cloudStoreDatabase/project-member'
import { status } from '@root/constants/index'

module.exports = async (req, res) => {
  const { leaveAppId, isApproved = false } = req.params
  const data = await getTsApp(leaveAppId)
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
      updateTsApp(data)
      return res.send({ message: 'Successfully.' })
    }
    if (data.status == status.inPending) {
      data.approvalCosre += req.user.positionPermissionId
      if (data.approvalCosre == process.env.POSITION_ADMIN) {
        data.status = status.approved
        updateTmsDateApp(data)
      }
      updateTsApp(data)
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

const updateTmsDateApp = async data => {
  const result = await getTimesheetUserdate(data.userId, data.requiredDate)
  if (result) {
    result.startTime = data.startTime ? data.startTime : timesheet.startTime
    result.endTime = data.endTime ? data.endTime : timesheet.endTime
    updateTimesheet(data.userId, result)
  } else {
    timesheet.startTime = data.startTime ? data.startTime : timesheet.startTime
    timesheet.endTime = data.endTime ? data.endTime : timesheet.endTime
    saveTimesheet(timesheet)
  }
}
