import { timesheetApplicationCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'
import getUserIdsByManagerId from '@helpers/project/getUserIdsByManagerId.js'

export default async (req, res) => {
  let { page = 1, limit = 15 } = req.query
  const userId = req.user.id

  // TODO: page, limit must be greater than 0  (handle by OpenAPI)
  // TODO: remove 2 line parser below when openAPI is applied
  page = parseInt(page)
  limit = parseInt(limit)

  const role = await getRole(req.user.positionPermissionId)
  if (!role) return res.sendStatus(403)

  const userIds = role === "project manager" ? await getUserIdsByManagerId(userId) : []
  const totalIgnoreApp = (page - 1) * limit
  let query = timesheetApplicationCollection().where('isActive', '==', 1)

  if (role === 'project manager') {
    query = query.where('userId', 'in', userIds)
  } else if (role === 'user') {
    query = query.where('userId', '==', userId)
  }

  const allTimesheetApps = await query.get()
  let timesheetApps
  if (totalIgnoreApp === 0) {
    timesheetApps = await query.orderBy('created').limit(limit).get()
  } else {
    const lastIgnoreApp = allTimesheetApps.docs[totalIgnoreApp - 1].data()
    timesheetApps = await query.orderBy('created').startAfter(lastIgnoreApp.created).limit(limit).get()
  }

  return res.send({
    count: allTimesheetApps.size,
    timesheetApplications: timesheetApps.docs.map(appSnapshot => {
      const app = appSnapshot.data()
      return {
        ...app,
        created: app.created.toDate(),
        updated: app.updated ? app.updated.toDate() : undefined
      }
    })
  })
}
