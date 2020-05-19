import { format } from 'date-fns/fp'
import _ from 'lodash/fp'
import getRole from '@helpers/users/getRole'
import { projectCollection } from '@root/database'
import { execute } from '@root/util.js'
import getProjectId from '@routes/projects/_projectId/get.js'
import getUserId from '@routes/users/_userId/get.js'
const initProject = {
  id: '',
  projectName: '',
  createdUserId: '',
  startDate: '',
  endDate: '',
  status: -1,
  isActive: true,
  created: format('yyyy-MM-dd HH:mm:ss', new Date()),
  updated: '',
  managerId: '',
  members: [],
}

export default async (req, res) => {
  try {
    const createdUserId = req.user.id
    const { id, managerId, projectName } = req.body

    const role = await getRole(createdUserId)
    if (role !== 'admin') return res.sendStatus(403)
    if (id == '' || managerId == '' || projectName == '')
      return res.sendStatus(400)
    const user = await execute(getUserId, {
      params: { userId: managerId },
    })
    if (user.status == 404 || !user.body) return res.sendStatus(400)
    const isValidProjectId = await execute(getProjectId, {
      query: { projectId: id },
    })
    if (isValidProjectId.status != 404) return res.sendStatus(400)
    const newProject = {
      createdUserId,
      ..._.defaultsDeep(initProject, req.body),
    }
    await projectCollection().doc(newProject.id).set(newProject)
    return res.send(newProject)
  } catch (error) {
    res.sendStatus(500)
  }
}
