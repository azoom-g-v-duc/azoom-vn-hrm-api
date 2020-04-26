import { leaveApplicationCollection } from '@root/database'

export default async (req, res) => {
  const { leaveAppId } = req.params
  
  const queryData = await leaveApplicationCollection().where('id', '==', leaveAppId).get()
  res.send(queryData.empty ? '' : queryData.docs[0].data())
}
