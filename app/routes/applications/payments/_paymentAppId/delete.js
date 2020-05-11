import { paymentCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'
import { applicationStatus } from '@root/constants.js'

export default async (req, res) => {
  const userId = req.user.id
  const { paymentAppId } = req.query

  const payment = await paymentCollection().doc(paymentAppId).get()
  if (!payment.exists) return res.sendStatus(404)
  if (payment.data().status !== applicationStatus.pending) return res.sendStatus(400)

  const role = await getRole(req.user.positionPermissionId)
  if (role !== 'admin' && payment.data().userId !== userId) return res.sendStatus(403)
  await paymentCollection().doc(paymentAppId).update({ isActive: false })
  return res.sendStatus(200)
}
