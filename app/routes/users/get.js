import { userCollection } from '@root/database'

export const getUser = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 0
  const count = parseInt(req.query.count) || ''

  return res.send(await getAllUser(pageNumber, count))
}

const getAllUser = async (page, number) => {
  const result = { count: 0, data: [] }
  const query = await userCollection().orderBy('created', 'desc')
  const datall = await query.get()
  result.count = datall.empty ? 0 : await datall.docs.length
  if (!page) {
    result.data = datall.empty ? '' : await datall.docs.map((doc) => doc.data())
    return result
  }
  if (page && number && page * number - 1 <= result.count) {
    const queryData = await query
      .startAt(await datall.docs[page - 1 ? (page - 1) * number : page - 1].data().created)
      .limit(number)
      .get()
    result.data = queryData.empty ? '' : await queryData.docs.map((doc) => doc.data())
    return result
  }

  return result
}
