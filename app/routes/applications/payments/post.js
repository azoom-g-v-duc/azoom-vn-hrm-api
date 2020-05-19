import { paymentCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'
import { format } from 'date-fns/fp'
import { paymentIdPrefix } from '@constants/index.js'

export default async (req, res) => {
  const userId = req.user.id
  const payment = req.body

  const role = await getRole(userId)
  if(!['admin', 'editor'].includes(role)) return res.sendStatus(403)

  const id = paymentIdPrefix + '-' + format('yyyyMMddHHmmss', new Date())

  const defaultPayment = {
    id,
    userId,
    status: -1,
    reason: '',
    amount: '',
    isActive: false,
    created: new Date(),
    updated: ''
  }
  
  const newPayment = {...defaultPayment, ...payment}
  await paymentCollection().doc(newPayment.id).set(newPayment)
  return res.send(newPayment)
}
