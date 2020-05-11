import _ from 'lodash/fp'
import getRole from '@helpers/users/getRole'
import updateMember from '@helpers/project/updateMember'
import { projectCollection } from '@root/database.js'
import { execute } from '@root/util.js'
import getProjectId from '@routes/projects/_projectId/get.js'
import getUserId from '@routes/users/_userId/get.js'
import getMemberId from '@routes/projects/_projectId/members/_memberId/get.js'
import { format } from 'date-fns/fp'

export default async (req, res) => {
  try {
    const { projectId, memberId } = req.params
    const role = await getRole(req.user.positionPermissionId)
    if (role !== 'admin') return res.sendStatus(403)

    const project = await execute(getProjectId, { query: { projectId } })
    if (project.status === 404 || !project.body) return res.sendStatus(400)

    const user = await execute(getUserId, { params: { userId: memberId } })
    if (user.status === 404 || !user.body) return res.sendStatus(400)

    const member = await execute(getMemberId, { params: { projectId, memberId } })
    if (member.status === 404 || !member.body) return res.sendStatus(400)

    const { members } = project.body
    const newMember = _.defaultsDeep(member.body, req.body)
    newMember.updatedDate = format('yyyy/MM/dd HH:mm:ss', new Date())
    const updateListMember = updateMember(members, newMember)
    await projectCollection()
      .doc(projectId)
      .update({ members: updateListMember })
    return res.send(newMember)
  } catch (error) {
    res.sendStatus(500)
  }
}
