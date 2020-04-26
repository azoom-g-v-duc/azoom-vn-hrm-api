const { projectCollection } = require('@root/database')

export default async (req, res) => {
  const { managerId, memberId, status } = req.query

  let query = projectCollection().where('isActive', '==', true)
  if (memberId) {
    query = query.where('members', 'array-contains', { id: memberId })
  }
  if (managerId) {
    query = query.where('managerId', '==', managerId)
  }
  if (status) {
    query = query.where('status', '==', status)
  }
  const result = await query.get()
  res.send(result.empty ? [] : result.docs.map((doc) => doc.data()))
}
