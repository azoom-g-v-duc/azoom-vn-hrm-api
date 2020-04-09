const { projectCollection } = require('@root/database')

export default async (req, res) => {
  const { projectId } = req.params

  const queryData = await projectCollection().where('id', '==', projectId).get()
  res.send(queryData.empty ? '' : queryData.docs[0].data())
}
