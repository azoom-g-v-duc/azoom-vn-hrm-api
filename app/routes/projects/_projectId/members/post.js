import { member as pmReq } from '@constants/models'
import { isAdmin } from '@helpers/check-rule'
const getProjectById = require('@routes/projects/_projectId/get')
const _ = require('lodash/fp')
import { execute } from '@root/util'
import getUserById from '../../../users/_userId/get'
import saveProject from '../../put'

module.exports = async (req, res) => {
  const { projectId } = req.params
  const data = _.defaultsDeep(pmReq, req.body)
  data.projectId = projectId
  const project = await execute(getProjectById, { params: { projectId } })

  if (!(await project)) {
    return res.sendStatus(400)
  }
  if (isAdmin(req.user.positionPermissionId)) {
    if (await isValidProjectMember(data.id, project)) {
      data.createdUserId = req.user.id
      const members = insertOrUpdateMember(project, data)
      data.members = members
      await execute(saveProject, { body: project })
      return res.send(oldMember)
    }
    return res.sendStatus(400)
  }

  return res.sendStatus(403)
}

const isValidProjectMember = async (id, project) => {
  const user = await execute(getUserById, { params: { userId: id } })
  const isContained = project.members.find(member.id === id && member.isActive)
  return !user || isContained
}

const insertOrUpdateMember = (project, newMember) => {
  const oldMember = project.members.filter((member) => member.id === newMember.id)
  if (oldMember) {
    return project.members.reduce((members, member) => {
      if (member.id === newMember.id) {
        member = _.defaultsDeep(member, newMember)
      }
      return [...members, member]
    }, [])
  }
  return [...project.members, newMember]
}
