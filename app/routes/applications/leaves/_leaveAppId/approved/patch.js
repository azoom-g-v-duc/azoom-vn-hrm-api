import {
  updateLeaveApp,
  getAllLeaveAppUserList,
  getLeaveApp
} from '@cloudStoreDatabase/leave-application'
import {
  updateTimesheet,
  getTimesheetUserday,
  saveTimesheet,
  timesheet
} from '@cloudStoreDatabase/time-sheet'

import { isProjectManager, isAdmin, isEditor } from '@helpers/check-rule'
import { getManagerProjectList } from '@cloudStoreDatabase/project'

module.exports = async (req, res) => {
  const { leaveAppId } = req.params
  const data = await getLeaveApp(leaveAppId)
  console.log(data)
  if (!data) {
    return res.sendStatus(404)
  }
  data.status = 1
  if (
    isAdmin(req.user.positionPermissionId) ||
    isEditor(req.user.positionPermissionId)
  ) {
    console.log(data)
    updateLeaveApp(data)
    udpateLeaveToTimesheet(data.userId, data.requiredDates)
    return res.send({ message: 'Successfully.' })
  }
  if (isProjectManager(req.user.positionPermissionId)) {
    const projectlist = await getManagerProjectList(req.user.id)
    const memberList = await getProjectIdMemberList(
      projectlist.map(item => item.id)
    )

    const timsheetList = await getAllLeaveAppUserList(
      0,
      '',
      memberList.map(item => item.id)
    )
    if (timsheetList.find(item => (item.id = data.id))) {
      updateLeaveApp(data)
      udpateLeaveToTimesheet(data.userId, data.requiredDates)
      return res.send({ message: 'Successfully.' })
    }
  }
  return res.sendStatus(403)
}

const udpateLeaveToTimesheet = async (userId, dateList) => {
  console.log(dateList)
  dateList.forEach(async element => {
    console.log(element.date)
    const data = await getTimesheetUserday(userId, element.date)
    if (!(await data)) {
      timeSheet.checkedDate = element.date
      timeSheet.leaveTypeId = element.leaveType
      saveTimesheet(userId, timeSheet)
    }
    data.checkedDate = element.date
    data.leaveTypeId = element.leaveType
    updateTimesheet(data)
  })
}
