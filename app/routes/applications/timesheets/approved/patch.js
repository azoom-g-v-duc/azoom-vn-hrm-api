import {
  updateTsApp,
  getTsApp,
  getAllTsAppProjectlist
} from '@cloudStoreDatabase/timesheet-application'
import {
  updateTimesheet,
  savetimeSheet,
  getTimesheetUserday,
  timeSheet as timeSheetReq
} from '@cloudStoreDatabase/time-sheet'

import { isProjectManager, isAdmin, isEditor } from '@helpers/check-rule'
import { getManagerProjectList } from '@cloudStoreDatabase/project'

module.exports = async (req, res) => {
  const { timsheetAppId = '' } = req.body
  const data = await getTsApp(timsheetAppId)
  console.log(data)
  if (!data) {
    return res.sendStatus(404)
  }
  data.isApproved = true
  if (
    isAdmin(req.user.possitionPermissionId) ||
    isEditor(req.user.possitionPermissionId)
  ) {
    data.isApproved = true
    updateTsApp(data)
    const timesheet = await getTimesheetUserday(data.userId, data.requiredDate)
    timesheet.startTime = data.startTime ? data.startTime : timesheet.startTime
    timesheet.endTime = data.endTime ? data.endTime : timesheet.endTime
    updateTimesheet(data.userId, timesheet)
    return res.send({ message: 'Approved successfully.' })
  }
  if (isProjectManager(req.user.possitionPermissionId)) {
    const projectlist = await getManagerProjectList(req.user.id)
    const timsheetList = await getAllTsAppProjectlist(
      0,
      '',
      projectlist.map(item => item.id)
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
      await updateTimesheet(data.userId, timesheet)
      return res.send({ message: 'Approved successfully.' })
    }
  }
  return res.sendStatus(403)
}
