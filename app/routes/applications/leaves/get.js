import { execute } from '@root/util'
import getProject from '@routes/projects/get'
import { leaveApplicationCollection } from '@root/database'
import getRole from '@helpers/users/getRole'

export default async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 0
  const count = parseInt(req.query.count) || ''

  const role = await getRole(req.user.id)
  if (['admin', 'editor'].includes(role)) {
    return res.send(await getLeaveAppOfUsers(pageNumber, count))
  }

  if (role === 'project manager') {
    const projectResponse = await execute(getProject, {
      query: { managerId: req.user.id },
    })
    const projects = projectResponse.status === 200 ? projectResponse.body : []
    const members = projects.reduce((members, project) => {
      return {
        ...members,
        ...project.members.filter((member) => member.isActive),
      }
    }, [])

    return res.send(
      await getLeaveAppOfUsers(
        pageNumber,
        count,
        members.map((item) => item.id)
      )
    )
  }
  return res.send(await getLeaveAppOfUsers(pageNumber, count, [req.user.id]))
}

const getLeaveAppOfUsers = async (page, number, userIds = []) => {
  const result = { count: 0, data: [] }
  let query = await leaveApplicationCollection().orderBy('created', 'desc')
  if (userIds && userIds.length) {
    query = query.where('userId', 'in', userIds)
  }
  const leaveAppSnapshot = await query.get()
  result.count = leaveAppSnapshot.empty ? 0 : await leaveAppSnapshot.docs.length
  if (!page) {
    result.data = leaveAppSnapshot.empty
      ? ''
      : await leaveAppSnapshot.docs.map((doc) => doc.data())
    return result
  }
  if (page && number && page * number - 1 <= result.count) {
    const queryData = await query
      .startAt(
        await leaveAppSnapshot.docs[
          page - 1 ? (page - 1) * number : page - 1
        ].data().created
      )
      .limit(number)
      .get()
    result.data = queryData.empty
      ? []
      : await queryData.docs.map((doc) => doc.data())
    return result
  }

  return result
}
