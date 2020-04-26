import { project as projectReq } from '@constants/models'
import { isAdmin, isProjectManager } from '@helpers/check-rule'
import { execute } from '@root/util'
import getProjectById from '@routes/projects/_projectId/get'
import saveProject from '@routes/projects/put'

const _ = require('lodash')

module.exports = async (req, res) => {
  if (!(isAdmin(req.user.positionPermissionId) || isProjectManager(req.user.positionPermissionId))) {
    return res.sendStatus(403)
  }
  const data = _.defaultsDeep(req.body, projectReq)

  if (await isValidProject(data)) {
    data.createdUserId = req.user.id
    await execute(saveProject, { body: data })
    return res.send(data)
  }
  return res.sendStatus(400)
}

const isValidProject = async (projectId) => {
  if (projectId && !(await execute(getProjectById, { params: { projectId } }))) {
    return true
  }
  return false
}
