import _ from 'lodash/fp'
import { userCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'

export default async (req, res) => {
  let { page = 1, limit = 15 } = req.query

  const role = await getRole(req.user.positionPermissionId)
  if (!['admin', 'editor'].includes(role)) return res.sendStatus(403)

  // TODO: page, limit must be greater than 0  (handle be OpenAPI)
  // TODO: remove 2 line parser below when openAPI is applied
  page = parseInt(page)
  limit = parseInt(limit)
  const totalIgnoreUser = (page - 1) * limit

  if (totalIgnoreUser === 0) {
    const users = await userCollection().orderBy('created').limit(limit).get()
    if (users.empty) return res.send([])

    return res.send(users.docs.map((user) => _.omit(['password'], user.data())))
  } else {
    const ignoreUsers = await userCollection().orderBy('created').limit(totalIgnoreUser).get()
    if (ignoreUsers.empty) return res.send([])

    const lastIgnoreUser = ignoreUsers.docs[ignoreUsers.docs.length - 1].data()
    const users = await userCollection().orderBy('created').startAfter(lastIgnoreUser.created).limit(limit).get()

    return res.send(users.docs.map((user) => _.omit(['password'], user.data())))
  }
}
