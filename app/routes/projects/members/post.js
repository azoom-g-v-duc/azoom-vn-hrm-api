import {
  projectMember as pmReq,
  saveProjectMember,
  isValidProjectMember
} from '@cloudStoreDatabase/project-member'
import { isProjectManager, isAdmin } from '@helpers/check-rule'
import { getProject } from '@cloudStoreDatabase/project'
import { getProjectListOfManagerId } from '@cloudStoreDatabase/project-member'

const _ = require('lodash')

module.exports = async (req, res) => {
  const data = _.defaultsDeep(req.body, pmReq)
  const project = await getProject(data.projectId)

  if (!(await project)) {
    return res.sendStatus(400)
  }
  console.log(isAdmin(req.user.positionPermissionId))
  if (
    isAdmin(req.user.positionPermissionId) ||
    (isProjectManager(req.user.positionPermissionId) &&
      (await getProjectListOfManagerId(req.user.id)))
  ) {
    if (await isValidProjectMember(data)) {
      data.createdUserId = req.user.id
      return res.send(await saveProjectMember(data))
    }
    return res.sendStatus(400)
  }

  return res.sendStatus(403)
}
