import {
  updateTsApp,
  getTsApp,
  getAllTsAppUserList
} from '@cloudStoreDatabase/timesheet-application'

import { isProjectManager, isAdmin, isEditor } from '@helpers/check-rule'
import { getManagerProjectList } from '@cloudStoreDatabase/project'

module.exports = async (req, res) => {
  const { timesheetAppId } = req.params
  const data = await getTsApp(timesheetAppId)
  if (!data) {
    return res.sendStatus(404)
  }
  data.status = 0
  if (
    isAdmin(req.user.positionPermissionId) ||
    isEditor(req.user.positionPermissionId)
  ) {
    updateTsApp(data)
    return res.send({ message: 'Successfully.' })
  }
  if (isProjectManager(req.user.positionPermissionId)) {
    const projectlist = await getManagerProjectList(req.user.id)
    const timsheetList = await getAllTsAppUserList(
      0,
      '',
      projectlist.map(item => item.id)
    )
    if (timsheetList.find(item => (item.id = data.id))) {
      updateTsApp(data)
      return res.send({ message: 'Successfully.' })
    }
  }
  return res.sendStatus(403)
}
