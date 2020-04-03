import {
  updateTsApp,
  getTsApp,
  getAllTsAppUserList
} from '@cloudStoreDatabase/timesheet-application'
import {
  updateTimesheet,
  getTimesheetUserday
} from '@cloudStoreDatabase/time-sheet'

import { isProjectManager, isAdmin, isEditor } from '@helpers/check-rule'
import { getManagerProjectList } from '@cloudStoreDatabase/project'

module.exports = async (req, res) => {
  const { leaveAppId } = req.params
  const data = await getTsApp(leaveAppId)
  if (!data) {
    return res.sendStatus(404)
  }
  data.status = 1
  if (
    isAdmin(req.user.positionPermissionId) ||
    isEditor(req.user.positionPermissionId)
  ) {
    updateTsApp(data)
    const timesheet = await getTimesheetUserday(data.userId, data.requiredDate)
    timesheet.startTime = data.startTime ? data.startTime : timesheet.startTime
    timesheet.endTime = data.endTime ? data.endTime : timesheet.endTime
    updateTimesheet(data.userId, timesheet)
    return res.send({ message: 'Successfully.' })
  }
  if (isProjectManager(req.user.positionPermissionId)) {
    const projectlist = await getManagerProjectList(req.user.id)
    const memberList = await getProjectIdMemberList(
      projectlist.map(item => item.id)
    )

    const timsheetList = await getAllTsAppUserList(
      0,
      '',
      memberList.map(item => item.id)
    )
    if (timsheetList.find(item => (item.id = data.id))) {
      updateTsApp(data)
      const timesheet = await getTimesheetUserday(
        data.userId,
        data.requiredDate
      )
      timesheet.startTime = data.startTime
        ? data.startTime
        : timesheet.startTime
      timesheet.endTime = data.endTime ? data.endTime : timesheet.endTime
      await updateTimesheet(timesheet)
      return res.send({ message: 'Successfully.' })
    }
  }
  return res.sendStatus(403)
}
