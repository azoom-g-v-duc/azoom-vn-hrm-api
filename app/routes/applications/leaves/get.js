import { execute } from '@root/util'
import getProject from '@routes/projects/get'
import { leaveApplicationCollection } from '@root/database'
import getRole from '@helpers/users/getRole'

module.exports = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 0
  const count = parseInt(req.query.count) || ''
  const role = await getRole(req.user.id)
  if (role === 'admin' || role === 'editor') {
    return res.send(await getAllLeaveAppOfUserList(pageNumber, count, []))
  }
  if (role === 'project manager') {
    const projectlist = await execute(getProject, {
      query: { managerId: req.user.id },
    })
    const memberList = projectlist.reduce((members, project) => {
      return {
        ...members,
        ...project.members.filter((member) => member.isActive),
      }
    }, [])

    return res.send(
      await getAllLeaveAppOfUserList(
        pageNumber,
        count,
        memberList.map((item) => item.id)
      )
    )
  }
  return res.send(
    await getAllLeaveAppOfUserList(pageNumber, count, [req.user.id])
  )
}

const getAllLeaveAppOfUserList = async (page, number, userIdList) => {
  
  const result = { count: 0, data: [] }
  let query = await leaveApplicationCollection().orderBy('created', 'desc')
  if (userIdList && userIdList.length) {
    query = query.where('userId', 'in', userIdList)
  }
  const datall = await query.get()
  
  result.count = datall.empty ? 0 : await datall.docs.length
  if (!page) {
    result.data = datall.empty ? '' : await datall.docs.map((doc) => doc.data())
    return result
  }
  if (page && number && page * number - 1 <= result.count) {
    const queryData = await query
      .startAt(
        await datall.docs[page - 1 ? (page - 1) * number : page - 1].data()
          .created
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
