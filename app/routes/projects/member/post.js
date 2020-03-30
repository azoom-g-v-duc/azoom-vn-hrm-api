import {
  projectMember as pmReq,
  saveProjectMember,
  isValidProjectMember
} from '@cloudStoreDatabase/project-member'
import { isProjectManager, isAdmin } from '@helpers/check-rule'
import { checkProjectManager, getProject } from '@cloudStoreDatabase/project'

const _ = require('lodash')

module.exports = async (req, res) => {
  const data = _.defaultsDeep(req.body, pmReq)
  if (
    !(
      isAdmin(req.user.possitionPermissionId) ||
      isProjectManager(req.user.possitionPermissionId)
    )
  ) {
    return res.sendStatus(403)
  }

  const project = await getProject(data.projectId)

  if (
    ((await project) && data.memberId == (await project.managerId)) ||
    !(await project)
  ) {
    return res.sendStatus(400)
  }

  if (
    isProjectManager(req.user.possitionPermissionId) &&
    !(await checkProjectManager(req.user.id, data.projectId))
  ) {
    return res.sendStatus(403)
  }
  if (await isValidProjectMember(data)) {
    data.createdUserId = req.user.id
    return res.send(await saveProjectMember(data))
  }
  return res.sendStatus(400)
}
