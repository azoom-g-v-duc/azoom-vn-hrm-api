import { format } from 'date-fns/fp'
import _ from 'lodash/fp'
import getRole from '@helpers/users/getRole'
import updateMember from '@helpers/project/updateMember'
import { projectCollection } from '@root/database.js'
import { execute } from '@root/util.js'
import getMembers from '@routes/projects/_projectId/members/get.js'
import getUserId from '@routes/users/_userId/get.js'
import getMemberId from '@routes/projects/_projectId/members/_memberId/get.js'

export default async (req, res) => {
  try {
    const { projectId, memberId } = req.params
    const role = await getRole(req.user.positionPermissionId)
    if (role !== 'admin') return res.sendStatus(403)
    const listMember = await execute(getMembers, {
      params: { projectId },
    })
    const { members } = listMember.body
    if (listMember.status === 404 || !members) return res.sendStatus(400)
    const user = await execute(getUserId, { params: { userId: memberId } })
    if (user.status === 404 || !user.body) return res.sendStatus(400)
    // TODO: chỉnh sửa lại sau khi tách project-member ra 1 nơi riêng.
    const memberInfo = await execute(getMemberId, {
      params: { projectId, memberId },
    })
    if (
      memberInfo.status === 404 ||
      !memberInfo.body ||
      memberInfo.body.isActive !== 1 ||
      memberInfo.body.length === 0
    )
      return res.sendStatus(400)
    const newMember = { ...memberInfo.body }
    const { position = [] } = newMember.body
    newMember.updatedDate = format('yyyy/MM/dd HH:mm:ss', new Date())
    newMember.isActive = 0
    newMember.position = [
      ..._.initial(position),
      updatePosition(_.last(position)),
    ]
    const updateListMember = updateMember(members, newMember)
    await projectCollection()
      .doc(projectId)
      .update({ members: updateListMember })
    return res.send(member.body)
  } catch (error) {
    res.sendStatus(500)
  }
}

const updatePosition = (lastPosition) => {
  const dateNow = format('yyyy-MM-dd', new Date())
  if (
    new Date(dateNow).getTime() <= new Date(lastPosition.end).getTime() ||
    !lastPosition.end
  ) {
    lastPosition.end = dateNow
  }
  return lastPosition
}
