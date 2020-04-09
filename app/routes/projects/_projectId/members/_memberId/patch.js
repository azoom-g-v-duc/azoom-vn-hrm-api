// import {
//   UpdateProjectMember,
//   getIdProjectMember,
//   isValidProjectMember
// } from '@cloudStoreDatabase/project-member'
// import { isAdmin } from '@helpers/check-rule'
// import { getProject } from '@cloudStoreDatabase/project'

// const _ = require('lodash/fp')

// module.exports = async (req, res) => {
//   const { projectId, memberId } = req.params
//   const project = await getProject(projectId)
//   const member = getIdProjectMember(projectId, memberId)
//   const data = _.defaultsDeep(member, req.body)

//   if (!member || !project) {
//     return res.sendStatus(404)
//   }

//   if (isAdmin(req.user.positionPermissionId)) {
//     return res.send(await UpdateProjectMember(data))
//   }

//   return res.sendStatus(403)
// }
