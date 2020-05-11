import { paymentCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'

export default async (req, res) => {
  const userId = req.user.id
  const { paymentAppId } = req.query

  const role = await getRole(req.user.positionPermissionId)
  if(!['admin', 'editor'].includes(role)) return res.sendStatus(403)

  const paymentDetail = await paymentCollection().doc(paymentAppId).get()
  if(!paymentDetail.exists) return res.sendStatus(404)
  return res.send(paymentDetail.data())
}
