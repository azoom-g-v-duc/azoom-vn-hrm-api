import firebase from 'firebase'
import _ from 'lodash/fp'
import { projectCollection } from '@root/database.js'
import getRole from '@helpers/users/getRole'
import { execute } from '@root/util.js'
import getProjectId from '@routes/projects/_projectId/get.js'
import getMemberId from '@routes/projects/_projectId/members/_memberId/get.js'
import getUserId from '@routes/users/_userId/get.js'
import { format } from 'date-fns/fp'

const initMember = {
  isActive: 1,
  createdUserId: '',
  createdDate: '',
  updatedDate: '',
  fullName: '',
  position: [
    {
      positionScore: 0,
      start: '',
      end: '',
    },
  ],
}

export default async (req, res) => {
  const { projectId } = req.params
  try {
    const role = await getRole(req.user.positionPermissionId)
    if (role !== 'admin') return res.sendStatus(403)
    const memberProfile = _.defaultsDeep(req.body, initMember)
    const project = await execute(getProjectId, {
      query: { projectId },
    })
    if (project.status === 404 || !project.body) return res.sendStatus(404)
    const user = await execute(getUserId, {
      params: { userId: memberProfile.memberId },
    })
    if (user.status === 404 || !user.body) return res.sendStatus(404)
    const member = await execute(getMemberId, {
      params: { projectId, memberId: memberProfile.memberId },
    })
    if (member.status !== 404) return res.sendStatus(400)
    memberProfile.createdUserId = req.user.id
    memberProfile.createdDate = format('yyyy/MM/dd HH:mm:ss', new Date())
    memberProfile.fullName = user.body.fullName
    const addMember = {
      members: firebase.firestore.FieldValue.arrayUnion(memberProfile),
    }
    await projectCollection().doc(projectId).update(addMember)
    return res.send(memberProfile)
  } catch (error) {
    res.sendStatus(500)
  }
}
